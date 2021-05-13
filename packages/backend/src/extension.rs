use riker::actors::*;
use std::default::Default;
use std::sync::Arc;
use tokio::{
    runtime::Runtime,
    sync::{
        broadcast::{channel as broadcast_channel, Receiver, Sender as BroadcastSender},
        mpsc::{unbounded_channel, UnboundedReceiver, UnboundedSender},
        Mutex,
    },
};

use crate::actors::KillMessage;
use crate::{dispatch, wallet_actors, DispatchMessage as WalletDispatchMessage, MessageFallback};
use crate::{extension_actors};
use glow::{
    handler::{ExtensionHandler},
    message::{
        CallbackMessage as ExtensionCallbackMessage, DispatchMessage as ExtensionDispatchMessage,
        ExtensionError, Message as ExtensionMessage, Response as ExtensionResponse,
        ResponseType as ExtensionResponseType, Result as ExtensionResult,
    },
};

// pub use iota_wallet::actor::MessageType as WalletMessageType;

#[derive(Debug, Clone)]
pub struct EventMessage {
    event: String
}

#[actor(ExtensionMessage, KillMessage, EventMessage)]
pub struct ExtensionActor {
    runtime: Runtime,
    handler: Arc<Mutex<ExtensionHandler>>,
}

impl Actor for ExtensionActor {
    type Msg = ExtensionActorMsg;

    fn recv(&mut self, ctx: &Context<Self::Msg>, msg: Self::Msg, sender: Sender) {
        self.receive(ctx, msg, sender)
    }
}

impl Receive<ExtensionMessage> for ExtensionActor {
    type Msg = ExtensionActorMsg;
    fn receive(&mut self, _ctx: &Context<Self::Msg>, msg: ExtensionMessage, _sender: Sender) {
        let message_handler = self.handler.clone();
        self.runtime.spawn(async move {
            let mut message_handler = message_handler.lock().await;
            message_handler.receive(msg).await;
        });
    }
}

impl Receive<KillMessage> for ExtensionActor {
    type Msg = ExtensionActorMsg;
    fn receive(&mut self, ctx: &Context<Self::Msg>, _msg: KillMessage, _sender: Sender) {
        let message_handler = self.handler.clone();
        self.runtime.spawn(async move {
            // kill the WS server if its alive
            let message_handler = message_handler.lock().await;
            let quit_sender = message_handler.quit_sender.clone();
            let _ = quit_sender.send(());
        });
        ctx.stop(ctx.myself());
    }
}

impl Receive<EventMessage> for ExtensionActor {
    type Msg = ExtensionActorMsg;
    fn receive(&mut self, _ctx: &Context<Self::Msg>, msg: EventMessage, _sender: Sender) {
        let message_handler = self.handler.clone();
        self.runtime.spawn(async move {
            let message_handler = message_handler.lock().await;
            let quit_sender = message_handler.event_sender.clone();
            let _ = quit_sender.send(msg.event);
        });
    }
}

// from browser
async fn callback(message: String, actor_id: String) -> ExtensionResult<String> {
    // dispatch to WalletActor and return result
    let actors = wallet_actors().lock().await;
    if let Some(actor) = actors.get(&actor_id) {
        match serde_json::from_str::<WalletDispatchMessage>(message.as_str()) {
            Ok(wallet_message) => {
                match dispatch(&actor.actor, wallet_message).await {
                    Ok(response) => {
                        if let Some(response) = response {
                            return Ok(response);
                        } else {
                            return Err(ExtensionError::MessageError(
                                "response not ok".to_string(),
                            ));
                        }
                    }
                    Err(e) => {
                        return Err(ExtensionError::MessageError(e.to_string()));
                    }
                };
            }
            Err(e) => {
                return Err(ExtensionError::MessageError(e.to_string()));
            }
        }
    } else {
        Err(ExtensionError::MessageError("actor not found".to_string()))
    }
}

pub(crate) fn send_event_to_extension(
    extension_actor: &ActorRef<ExtensionActorMsg>,
    message: String
) -> Result<(), String> {
    extension_actor.tell(EventMessage{
        event: message
    }, None);
    Ok(())
}

impl ActorFactoryArgs<String> for ExtensionActor {
    fn create_args(actor_id: String) -> Self {
        let run = Runtime::new().expect("failed to create tokio runtime");

        let (tx, mut rx): (
            UnboundedSender<ExtensionCallbackMessage>,
            UnboundedReceiver<ExtensionCallbackMessage>,
        ) = unbounded_channel();
        let aid = actor_id.clone();

        let (quit_sender, quit_receiver): (BroadcastSender<()>, Receiver<()>) =
        broadcast_channel(1);

        let (event_sender, event_receiver): (BroadcastSender<String>, Receiver<String>) =
        broadcast_channel(99999999);

        let h = Arc::new(Mutex::new(ExtensionHandler {
            sender: tx,
            quit: Arc::new(Mutex::new(quit_receiver)),
            quit_sender: quit_sender,
            event_receiver: Arc::new(Mutex::new(event_receiver)),
            event_sender: event_sender,
            initialized: false,
        }));

        let message_handler = h.clone();
        run.spawn(async move {
            while let Some(r) = rx.recv().await {
                if let Ok(s) = r.payload.clone() {
                    let mut message_handler = message_handler.lock().await;
                    // only let ExtensionMessageType through
                    let (msg, respond_directly) = message_handler.translate_message(s.as_str()).await;
                    if let Ok(message) = msg {
                        if respond_directly { // handler created the response
                            let _ = r.response_tx.send(message);
                        } else { // get the response from Wallet.rs
                            let res = callback(message.clone(), aid.clone()).await;
                            if let Ok(payload) = res {
                                let _ = r.response_tx.send(payload);
                            }
                        }
                    }
                }
            }
        });

        Self {
            runtime: run,
            handler: h,
        }
    }
}

impl Default for ExtensionActor {
    fn default() -> Self {
        let (quit_sender, quit_receiver): (BroadcastSender<()>, Receiver<()>) =
            broadcast_channel(1);
        let (event_sender, event_receiver): (BroadcastSender<String>, Receiver<String>) =
            broadcast_channel(1);
        Self {
            runtime: Runtime::new().expect("failed to create tokio runtime"),
            handler: Arc::new(Mutex::new(ExtensionHandler {
                sender: unbounded_channel().0,
                quit: Arc::new(Mutex::new(quit_receiver)),
                quit_sender: quit_sender,
                event_receiver: Arc::new(Mutex::new(event_receiver)),
                event_sender: event_sender,
                initialized: false,
            })),
        }
    }
}

pub(crate) async fn extension_dispatch(
    extension_actor: &ActorRef<ExtensionActorMsg>,
    message: ExtensionDispatchMessage,
) -> Result<Option<String>, String> {
    let (response_tx, mut response_rx) = unbounded_channel();

    extension_actor.tell(
        ExtensionMessage::new(message.id.clone(), message.message.clone(), response_tx),
        None,
    );

    let response = response_rx.recv().await;
    match response {
        Some(res) => Ok(Some(serde_json::to_string(&res).map_err(|e| {
            serde_json::to_string(&ExtensionResponse::new(
                message.id,
                message.message,
                ExtensionResponseType::Error(e.to_string()),
            ))
            .unwrap()
        })?)),
        None => Ok(None),
    }
}

pub async fn check_extension_dispatch(serialized_message:String, error:serde_json::Error) -> Option<(Option<String>, String)> {
    if let Ok(message) = serde_json::from_str::<ExtensionDispatchMessage>(&serialized_message) {
        let ext_actors = extension_actors().lock().await;
        let actor_id = message.actor_id.to_string();
        if let Some(extension_actor) = ext_actors.get(&actor_id) {
            match extension_dispatch(extension_actor, message).await {
                Ok(response) => Some((response, actor_id)),
                Err(e) => Some((Some(e), actor_id)),
            }
        } else {
            Some((
                Some(format!(
                    r#"{{ "type": "ActorNotInitialised", "payload": "{}" }}"#,
                    message.actor_id
                )),
                message.actor_id,
            ))
        }
    } else {
        if let Ok(message) = serde_json::from_str::<MessageFallback>(&serialized_message) {
            Some((
                Some(format!(
                    r#"{{
                        "type": "Error",
                        "id": {},
                        "payload": {{ 
                            "type": "InvalidMessage",
                            "message": {},
                            "error": {}
                        }}
                    }}"#,
                    match message.id {
                        Some(id) => serde_json::Value::String(id),
                        None => serde_json::Value::Null,
                    },
                    serialized_message,
                    serde_json::Value::String(error.to_string()),
                )),
                message.actor_id,
            ))
        } else {
            log::error!("[FIREFLY] backend sendMessage error: {:?}", error);
            None
        }
    }
}