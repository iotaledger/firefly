mod actors;
use actors::{dispatch, DispatchMessage, WalletActor, WalletActorMsg};

use iota::common::logger::logger_init;
pub use iota::common::logger::LoggerConfigBuilder;
use iota_wallet::event::{
    on_balance_change, on_broadcast, on_confirmation_state_change, on_error, on_new_transaction,
    on_reattachment,
};
use once_cell::sync::Lazy;
use riker::actors::*;
use serde::{Deserialize, Serialize};

use std::collections::HashMap;
use std::convert::TryFrom;
use std::path::Path;
use std::sync::{Arc, Mutex};

type WalletActors = Arc<Mutex<HashMap<String, ActorRef<WalletActorMsg>>>>;
type MessageReceiver = Box<dyn Fn(String) + Send + Sync + 'static>;
type MessageReceivers = Arc<Mutex<HashMap<String, MessageReceiver>>>;

fn wallet_actors() -> &'static WalletActors {
    static ACTORS: Lazy<WalletActors> = Lazy::new(Default::default);
    &ACTORS
}

fn message_receivers() -> &'static MessageReceivers {
    static RECEIVERS: Lazy<MessageReceivers> = Lazy::new(Default::default);
    &RECEIVERS
}

#[derive(Serialize, Deserialize, Copy, Clone)]
#[repr(C)]
pub enum EventType {
    ErrorThrown,
    BalanceChange,
    NewTransaction,
    ConfirmationStateChange,
    Reattachment,
    Broadcast,
}

impl TryFrom<&str> for EventType {
    type Error = String;

    fn try_from(value: &str) -> Result<Self, Self::Error> {
        let event_type = match value {
            "ErrorThrown" => EventType::ErrorThrown,
            "BalanceChange" => EventType::BalanceChange,
            "NewTransaction" => EventType::NewTransaction,
            "ConfirmationStateChange" => EventType::ConfirmationStateChange,
            "Reattachment" => EventType::Reattachment,
            "Broadcast" => EventType::Broadcast,
            _ => return Err(format!("invalid event name {}", value)),
        };
        Ok(event_type)
    }
}

pub async fn init<A: Into<String>, F: Fn(String) + Send + Sync + 'static>(
    actor_id: A,
    message_receiver: F,
    storage_path: Option<impl AsRef<Path>>,
) {
    let actor_id = actor_id.into();

    iota_wallet::with_actor_system(|sys| {
        let wallet_actor = match storage_path {
            Some(path) => sys
                .actor_of_args::<WalletActor, _>(&actor_id, path.as_ref().to_path_buf())
                .unwrap(),
            None => sys.actor_of::<WalletActor>(&actor_id).unwrap(),
        };

        let mut actors = wallet_actors()
            .lock()
            .expect("Failed to lock wallet_actors: init()");
        actors.insert(actor_id.to_string(), wallet_actor);

        let mut message_receivers = message_receivers()
            .lock()
            .expect("Failed to lock message_receivers: init()");
        message_receivers.insert(actor_id, Box::new(message_receiver));
    })
    .await;
}

pub fn destroy<A: Into<String>>(actor_id: A) {
    let mut actors = wallet_actors()
        .lock()
        .expect("Failed to lock wallet_actors: init()");
    let actor_id = actor_id.into();

    if let Some(actor) = actors.get(&actor_id) {
        actor.tell(actors::KillMessage, None);

        let mut message_receivers = message_receivers()
            .lock()
            .expect("Failed to lock message_receivers: respond()");
        message_receivers.remove(&actor_id);
    }

    actors.remove(&actor_id);
}

pub fn init_logger(config: LoggerConfigBuilder) {
    logger_init(config.finish()).expect("failed to init logger");
}

pub async fn send_message(message: String) {
    let data = match serde_json::from_str::<DispatchMessage>(&message) {
        Ok(message) => {
            let actors = wallet_actors()
                .lock()
                .expect("Failed to lock wallet_actors: send_message()");

            let actor_id = message.actor_id.to_string();
            if let Some(actor) = actors.get(&actor_id) {
                match dispatch(actor, message).await {
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
        }
        Err(error) => {
            log::error!("[FIREFLY] backend sendMessage error: {:?}", error);
            None
        }
    };

    if let Some((message, actor_id)) = data {
        if let Some(message) = message {
            respond(&actor_id, message).expect("actor dropped");
        }
    }
}

#[derive(Serialize)]
struct EventResponse<T: Serialize> {
    id: String,
    #[serde(rename = "type")]
    _type: EventType,
    payload: T,
}

impl<T: Serialize> EventResponse<T> {
    fn new<S: Into<String>>(id: S, event: EventType, payload: T) -> Self {
        Self {
            id: id.into(),
            _type: event,
            payload,
        }
    }
}

fn serialize_event<T: Serialize, S: Into<String>>(id: S, event: EventType, payload: T) -> String {
    serde_json::to_string(&EventResponse::new(id, event, payload)).unwrap()
}

fn respond<A: AsRef<str>>(actor_id: A, message: String) -> Result<(), String> {
    let message_receivers = message_receivers()
        .lock()
        .expect("Failed to lock message_receivers: respond()");

    if let Some(callback) = message_receivers.get(actor_id.as_ref()) {
        callback(message);
        Ok(())
    } else {
        Err("message receiver dropped".to_string())
    }
}

pub fn listen<A: Into<String>, S: Into<String>>(actor_id: A, id: S, event_type: EventType) {
    let id = id.into();
    let actor_id = actor_id.into();
    match event_type {
        EventType::ErrorThrown => on_error(move |error| {
            let _ = respond(&actor_id, serialize_event(id.clone(), event_type, &error));
        }),
        EventType::BalanceChange => on_balance_change(move |event| {
            let _ = respond(&actor_id, serialize_event(id.clone(), event_type, &event));
        }),
        EventType::NewTransaction => on_new_transaction(move |event| {
            let _ = respond(&actor_id, serialize_event(id.clone(), event_type, &event));
        }),
        EventType::ConfirmationStateChange => on_confirmation_state_change(move |event| {
            let _ = respond(&actor_id, serialize_event(id.clone(), event_type, &event));
        }),
        EventType::Reattachment => on_reattachment(move |event| {
            let _ = respond(&actor_id, serialize_event(id.clone(), event_type, &event));
        }),
        EventType::Broadcast => on_broadcast(move |event| {
            let _ = respond(&actor_id, serialize_event(id.clone(), event_type, &event));
        }),
    }
}

#[cfg(test)]
mod tests {
    use iota_wallet::actor::{MessageType, Response, ResponseType};
    use std::path::PathBuf;
    use std::sync::{mpsc::channel, Mutex};
    use std::time::Duration;

    #[test]
    fn basic() {
        run_actor("my-actor");
        run_actor("my-actor2");
    }

    fn run_actor(actor_id: &str) {
        smol::block_on(async {
            let (tx, rx) = channel();
            let tx = Mutex::new(tx);

            super::init(
                actor_id,
                move |message| {
                    let tx = tx.lock().unwrap();
                    tx.send(message).unwrap();
                },
                Option::<PathBuf>::None,
            )
            .await;
            super::send_message(format!(
                r#"{{
                    "actorId": "{}",
                    "id": "{}",
                    "cmd": "SetStrongholdPassword",
                    "payload": "password"
                }}"#,
                actor_id, "message-id"
            ))
            .await;

            if let Ok(message) = rx.recv_timeout(Duration::from_secs(5)) {
                assert_eq!(
                    message,
                    serde_json::to_string(&Response::new(
                        "message-id",
                        MessageType::SetStrongholdPassword("password".to_string()),
                        ResponseType::StrongholdPasswordSet
                    ))
                    .unwrap()
                )
            } else {
                panic!("response failed")
            }
        });
    }
}
