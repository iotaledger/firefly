mod actors;
use actors::{dispatch, WalletActor, WalletMessage};

use iota_wallet::{
    actor::ResponseType,
    event::{
        on_balance_change, on_broadcast, on_confirmation_state_change, on_error,
        on_new_transaction, on_reattachment,
    },
    WalletError,
};
use once_cell::sync::OnceCell;
use riker::actors::*;
use serde::{Deserialize, Serialize};

use std::convert::TryFrom;
use std::path::Path;

static WALLET_ACTOR: OnceCell<ActorRef<WalletMessage>> = OnceCell::new();
static MESSAGE_RECEIVER: OnceCell<Box<dyn Fn(String) + Send + Sync + 'static>> = OnceCell::new();

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

pub fn init<F: Fn(String) + Send + Sync + 'static>(
    message_receiver: F,
    storage_path: Option<impl AsRef<Path>>,
) {
    println!("Starting runtime");
    let sys = ActorSystem::new().unwrap();
    let wallet_actor = match storage_path {
        Some(path) => sys
            .actor_of_args::<WalletActor, _>("wallet-actor", path.as_ref().to_path_buf())
            .unwrap(),
        None => sys.actor_of::<WalletActor>("wallet-actor").unwrap(),
    };
    WALLET_ACTOR
        .set(wallet_actor)
        .expect("failed to set wallet actor globally");
    MESSAGE_RECEIVER
        .set(Box::new(message_receiver))
        .map_err(|_| ())
        .expect("failed to set message receiver globally");
}

pub async fn send_message(message: String) {
    let callback = MESSAGE_RECEIVER.get().unwrap();
    if let Some(actor) = WALLET_ACTOR.get() {
        match dispatch(actor, message.clone()).await {
            Ok(response) => {
                if let Some(response) = response {
                    callback(response);
                }
            }
            Err(e) => {
                callback(e);
            }
        }
    } else {
        callback(
            serde_json::to_string(&ResponseType::Error(WalletError::UnknownError(
                "runtime not initialized; send a `init` message before using the actor".to_string(),
            )))
            .unwrap(),
        );
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

pub fn listen<S: Into<String>>(id: S, event_type: EventType) {
    let callback = MESSAGE_RECEIVER.get().unwrap();
    let id = id.into();
    match event_type {
        EventType::ErrorThrown => {
            on_error(move |error| callback(serialize_event(id.clone(), event_type, &error)))
        }
        EventType::BalanceChange => on_balance_change(move |event| {
            callback(serialize_event(id.clone(), event_type, &event))
        }),
        EventType::NewTransaction => on_new_transaction(move |event| {
            callback(serialize_event(id.clone(), event_type, &event));
        }),
        EventType::ConfirmationStateChange => on_confirmation_state_change(move |event| {
            callback(serialize_event(id.clone(), event_type, &event))
        }),
        EventType::Reattachment => {
            on_reattachment(move |event| callback(serialize_event(id.clone(), event_type, &event)))
        }
        EventType::Broadcast => {
            on_broadcast(move |event| callback(serialize_event(id.clone(), event_type, &event)))
        }
    }
}
