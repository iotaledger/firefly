mod actors;
use actors::{dispatch, DispatchMessage, WalletActor, WalletActorMsg};

use iota::common::logger::logger_init;
pub use iota::common::logger::LoggerConfigBuilder;
use iota_wallet::{
    account_manager::{AccountManager, ManagerStorage, DEFAULT_STORAGE_FOLDER},
    event::{
        on_balance_change, on_broadcast, on_confirmation_state_change, on_error,
        on_new_transaction, on_reattachment, on_stronghold_status_change, on_transfer_progress,
        remove_balance_change_listener, remove_broadcast_listener,
        remove_confirmation_state_change_listener, remove_error_listener,
        remove_new_transaction_listener, remove_reattachment_listener,
        remove_stronghold_status_change_listener, remove_transfer_progress_listener, EventId,
    },
};
use once_cell::sync::Lazy;
use riker::actors::*;
use serde::{Deserialize, Serialize};
use tokio::sync::Mutex as AsyncMutex;

use std::collections::HashMap;
use std::convert::TryFrom;
use std::path::{Path, PathBuf};
use std::sync::{Arc, Mutex};
use std::time::Duration;

const POLLING_INTERVAL_MS: u64 = 30_000;

struct WalletActorData {
    listeners: Vec<(EventId, EventType)>,
    actor: ActorRef<WalletActorMsg>,
}

type WalletActors = Arc<AsyncMutex<HashMap<String, WalletActorData>>>;
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
    StrongholdStatusChange,
    TransferProgress,
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
            "StrongholdStatusChange" => EventType::StrongholdStatusChange,
            "TransferProgress" => EventType::TransferProgress,
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

    let mut actors = wallet_actors().lock().await;

    let manager = AccountManager::builder()
        .with_storage(
            match storage_path {
                Some(path) => path.as_ref().to_path_buf(),
                None => PathBuf::from(DEFAULT_STORAGE_FOLDER),
            },
            ManagerStorage::Sqlite,
            None,
        )
        .unwrap() //safe to unwrap, the storage password is None ^
        .with_polling_interval(Duration::from_millis(POLLING_INTERVAL_MS))
        .finish()
        .await
        .expect("failed to init account manager");

    iota_wallet::with_actor_system(|sys| {
        let wallet_actor = sys
            .actor_of_args::<WalletActor, _>(&actor_id, manager)
            .unwrap();

        actors.insert(
            actor_id.to_string(),
            WalletActorData {
                listeners: Vec::new(),
                actor: wallet_actor,
            },
        );

        let mut message_receivers = message_receivers()
            .lock()
            .expect("Failed to lock message_receivers: init()");
        message_receivers.insert(actor_id, Box::new(message_receiver));
    })
    .await;
}

pub async fn destroy<A: Into<String>>(actor_id: A) {
    let mut actors = wallet_actors().lock().await;
    let actor_id = actor_id.into();

    if let Some(actor_data) = actors.remove(&actor_id) {
        for (event_id, event_type) in &actor_data.listeners {
            match event_type {
                &EventType::ErrorThrown => remove_error_listener(event_id),
                &EventType::BalanceChange => remove_balance_change_listener(event_id).await,
                &EventType::NewTransaction => remove_new_transaction_listener(event_id).await,
                &EventType::ConfirmationStateChange => {
                    remove_confirmation_state_change_listener(event_id).await
                }
                &EventType::Reattachment => remove_reattachment_listener(event_id).await,
                &EventType::Broadcast => remove_broadcast_listener(event_id).await,
                &EventType::StrongholdStatusChange => {
                    remove_stronghold_status_change_listener(event_id).await
                }
                &EventType::TransferProgress => remove_transfer_progress_listener(event_id).await,
            };
        }

        actor_data.actor.tell(actors::KillMessage, None);
        iota_wallet::with_actor_system(|sys| {
            sys.stop(&actor_data.actor);
        })
        .await;

        let mut message_receivers = message_receivers()
            .lock()
            .expect("Failed to lock message_receivers: respond()");
        message_receivers.remove(&actor_id);
    }
}

pub fn init_logger(config: LoggerConfigBuilder) {
    logger_init(config.finish()).expect("failed to init logger");
}

#[derive(Deserialize)]
pub(crate) struct MessageFallback {
    #[serde(rename = "actorId")]
    pub(crate) actor_id: String,
    pub(crate) id: Option<String>,
}

pub async fn send_message(serialized_message: String) {
    let data = match serde_json::from_str::<DispatchMessage>(&serialized_message) {
        Ok(message) => {
            let actors = wallet_actors().lock().await;

            let actor_id = message.actor_id.to_string();
            if let Some(actor) = actors.get(&actor_id) {
                match dispatch(&actor.actor, message).await {
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
    };

    if let Some((message, actor_id)) = data {
        if let Some(message) = message {
            respond(&actor_id, message).expect("actor dropped");
        } else {
            log::error!(
                "[FIREFLY] unexpected empty response for message `{}`, the channel was dropped",
                serialized_message
            );
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

pub async fn listen<A: Into<String>, S: Into<String>>(actor_id: A, id: S, event_type: EventType) {
    let id = id.into();
    let actor_id = actor_id.into();

    let actor_id_ = actor_id.clone();
    let event_type_ = event_type.clone();

    let event_id = match event_type {
        EventType::ErrorThrown => on_error(move |error| {
            let _ = respond(&actor_id, serialize_event(id.clone(), event_type, &error));
        }),
        EventType::BalanceChange => {
            on_balance_change(move |event| {
                let _ = respond(&actor_id, serialize_event(id.clone(), event_type, &event));
            })
            .await
        }
        EventType::NewTransaction => {
            on_new_transaction(move |event| {
                let _ = respond(&actor_id, serialize_event(id.clone(), event_type, &event));
            })
            .await
        }
        EventType::ConfirmationStateChange => {
            on_confirmation_state_change(move |event| {
                let _ = respond(&actor_id, serialize_event(id.clone(), event_type, &event));
            })
            .await
        }
        EventType::Reattachment => {
            on_reattachment(move |event| {
                let _ = respond(&actor_id, serialize_event(id.clone(), event_type, &event));
            })
            .await
        }
        EventType::Broadcast => {
            on_broadcast(move |event| {
                let _ = respond(&actor_id, serialize_event(id.clone(), event_type, &event));
            })
            .await
        }
        EventType::StrongholdStatusChange => {
            on_stronghold_status_change(move |event| {
                let _ = respond(&actor_id, serialize_event(id.clone(), event_type, &event));
            })
            .await
        }
        EventType::TransferProgress => {
            on_transfer_progress(move |event| {
                let _ = respond(&actor_id, serialize_event(id.clone(), event_type, &event));
            })
            .await
        }
    };

    let mut actors = wallet_actors().lock().await;
    let actor = actors.get_mut(&actor_id_).expect("actor not initialised");
    actor.listeners.push((event_id, event_type_));
}

#[cfg(test)]
mod tests {
    use iota_wallet::actor::{MessageType, Response, ResponseType};
    use std::path::PathBuf;
    use std::sync::{mpsc::channel, Mutex};
    use std::time::Duration;
    use tokio::runtime::Runtime;

    #[test]
    fn basic() {
        let runtime = Runtime::new().unwrap();
        run_actor(&runtime, "my-actor");
        run_actor(&runtime, "my-actor2");
        run_actor(&runtime, "my-actor");
        run_actor(&runtime, "my-actor2");
    }

    fn run_actor(runtime: &Runtime, actor_id: &str) {
        runtime.block_on(async {
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

            // send a malformed message
            super::send_message(format!(
                r#"{{
                    "actorId": "{}",
                    "id": "{}",
                    "cmd": "SetStrongholdPassword"
                }}"#,
                actor_id, "message-id"
            ))
            .await;

            if let Ok(message) = rx.recv_timeout(Duration::from_secs(1)) {
                let value: serde_json::Value = serde_json::from_str(&message).unwrap();
                let json = value.as_object().unwrap();
                assert_eq!(
                    json.get("type"),
                    Some(&serde_json::Value::String("Error".to_string()))
                );
                let payload = json.get("payload").unwrap().as_object().unwrap();
                assert_eq!(
                    payload.get("type"),
                    Some(&serde_json::Value::String("InvalidMessage".to_string()))
                );
            } else {
                panic!("actor didn't reply after invalid message");
            }

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
                );

                super::destroy(actor_id).await;
                let res = convert_async_panics(|| {
                    super::send_message(format!(
                        r#"{{
                    "actorId": "{}",
                    "id": "{}",
                    "cmd": "SetStrongholdPassword",
                    "payload": "password"
                }}"#,
                        actor_id, "message-id"
                    ))
                })
                .await;
                assert_eq!(res.is_err(), true);
                assert_eq!(res.unwrap_err().contains("actor dropped"), true);
            } else {
                panic!("response failed")
            }
        });
    }

    use futures::{Future, FutureExt};
    use std::any::Any;
    use std::panic::AssertUnwindSafe;

    fn panic_message(panic: Box<dyn Any>) -> String {
        if let Some(message) = panic.downcast_ref::<String>() {
            message.to_string()
        } else if let Some(message) = panic.downcast_ref::<&str>() {
            message.to_string()
        } else {
            "Unknown error".to_string()
        }
    }

    async fn convert_async_panics<F>(f: impl FnOnce() -> F) -> Result<(), String>
    where
        F: Future<Output = ()>,
    {
        match AssertUnwindSafe(f()).catch_unwind().await {
            Ok(_) => Ok(()),
            Err(panic) => Err(panic_message(panic)),
        }
    }
}
