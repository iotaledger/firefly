mod actors;
use actors::{dispatch, WalletActor, WalletMessage};

use iota_wallet_actor::wallet::event::{
    on_balance_change, on_broadcast, on_confirmation_state_change, on_error, on_new_transaction,
    on_reattachment,
};
use once_cell::sync::OnceCell;
use riker::actors::*;

use std::path::Path;

static WALLET_ACTOR: OnceCell<ActorRef<WalletMessage>> = OnceCell::new();

#[repr(C)]
pub enum EventType {
    Error,
    BalanceChange,
    NewTransaction,
    ConfirmationStateChange,
    Reattachment,
    Broadcast,
}

pub fn init(storage_path: Option<impl AsRef<Path>>) {
    println!("Starting runtime");
    if let Some(path) = storage_path {
        iota_wallet_actor::wallet::storage::set_storage_path(path)
            .expect("failed to set storage path");
    }
    let sys = ActorSystem::new().unwrap();
    let wallet_actor = sys.actor_of::<WalletActor>("wallet-actor").unwrap();
    WALLET_ACTOR
        .set(wallet_actor)
        .expect("failed to set wallet actor globally");
}

pub async fn send_message(message: String) -> String {
    if let Some(actor) = WALLET_ACTOR.get() {
        match dispatch(actor, message.clone()).await {
            Ok(response) => {
                return response.unwrap_or("{}".to_string());
            }
            Err(e) => {
                return format!(r#"{{ "type": "error", "payload": "{}" }}"#, e);
            }
        }
    } else {
        return r#""{ "type": "error", "payload": "runtime not initialized; call `init` before sending messages" }""#.to_string();
    }
}

pub fn listen<F: Fn(String) + Send + Sync + 'static>(event_type: EventType, callback: F) {
    match event_type {
        EventType::Error => on_error(move |error| callback(serde_json::to_string(&error).unwrap())),
        EventType::BalanceChange => {
            on_balance_change(move |event| callback(serde_json::to_string(&event).unwrap()))
        }
        EventType::NewTransaction => on_new_transaction(move |event| {
            callback(serde_json::to_string(&event).unwrap());
        }),
        EventType::ConfirmationStateChange => on_confirmation_state_change(move |event| {
            callback(serde_json::to_string(&event).unwrap())
        }),
        EventType::Reattachment => {
            on_reattachment(move |event| callback(serde_json::to_string(&event).unwrap()))
        }
        EventType::Broadcast => {
            on_broadcast(move |event| callback(serde_json::to_string(&event).unwrap()))
        }
    }
}
