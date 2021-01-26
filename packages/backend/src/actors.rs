pub use iota_wallet::{
    account_manager::{AccountManager, ManagerStorage, DEFAULT_STORAGE_FOLDER},
    actor::{
        Message as WalletMessage, MessageType as WalletMessageType, Response, ResponseType,
        WalletMessageHandler,
    },
    Error,
};
use riker::actors::*;
use serde::Deserialize;
use tokio::{
    runtime::Runtime,
    sync::{mpsc::unbounded_channel, Mutex},
};

use std::{sync::Arc, time::Duration};

#[derive(Clone, Debug)]
pub struct KillMessage;

#[actor(WalletMessage, KillMessage)]
pub struct WalletActor {
    wallet_message_handler: Arc<Mutex<WalletMessageHandler>>,
    runtime: Runtime,
}

impl ActorFactoryArgs<AccountManager> for WalletActor {
    fn create_args(manager: AccountManager) -> Self {
        let runtime = Runtime::new().expect("failed to create tokio runtime");

        Self {
            wallet_message_handler: Arc::new(Mutex::new(WalletMessageHandler::with_manager(
                manager,
            ))),
            runtime,
        }
    }
}

impl Default for WalletActor {
    fn default() -> Self {
        let runtime = Runtime::new().expect("failed to create tokio runtime");
        let wallet_message_handler = Arc::new(Mutex::new(runtime.block_on(async move {
            WalletMessageHandler::with_manager(
                AccountManager::builder()
                    .with_storage(DEFAULT_STORAGE_FOLDER, ManagerStorage::Sqlite, None)
                    .unwrap() //safe to unwrap, the storage password is None ^
                    .with_polling_interval(Duration::from_millis(crate::POLLING_INTERVAL_MS))
                    .finish()
                    .await
                    .unwrap(),
            )
        })));
        Self {
            wallet_message_handler,
            runtime,
        }
    }
}

impl Actor for WalletActor {
    type Msg = WalletActorMsg;

    fn recv(&mut self, ctx: &Context<Self::Msg>, msg: Self::Msg, sender: Sender) {
        self.receive(ctx, msg, sender)
    }
}

impl Receive<WalletMessage> for WalletActor {
    type Msg = WalletActorMsg;

    fn receive(&mut self, _ctx: &Context<Self::Msg>, msg: WalletMessage, _sender: Sender) {
        let wallet_message_handler = self.wallet_message_handler.clone();
        self.runtime.spawn(async move {
            let mut wallet_message_handler = wallet_message_handler.lock().await;
            wallet_message_handler.handle(msg).await;
        });
    }
}

impl Receive<KillMessage> for WalletActor {
    type Msg = WalletActorMsg;

    fn receive(&mut self, ctx: &Context<Self::Msg>, _msg: KillMessage, _sender: Sender) {
        ctx.stop(ctx.myself());
    }
}

#[derive(Deserialize)]
pub(crate) struct DispatchMessage {
    #[serde(rename = "actorId")]
    pub(crate) actor_id: String,
    pub(crate) id: String,
    #[serde(flatten)]
    pub(crate) message: WalletMessageType,
}

pub(crate) async fn dispatch(
    wallet_actor: &ActorRef<WalletActorMsg>,
    message: DispatchMessage,
) -> Result<Option<String>, String> {
    let (response_tx, mut response_rx) = unbounded_channel();

    wallet_actor.tell(
        WalletMessage::new(message.id.clone(), message.message.clone(), response_tx),
        None,
    );

    let response = response_rx.recv().await;
    match response {
        Some(res) => Ok(Some(serde_json::to_string(&res).map_err(|e| {
            serde_json::to_string(&Response::new(
                message.id,
                message.message,
                ResponseType::Error(e.into()),
            ))
            .unwrap()
        })?)),
        None => Ok(None),
    }
}
