mod actors;
use actors::{dispatch, WalletActor, WalletMessage};

use once_cell::sync::OnceCell;
use riker::actors::*;

use std::path::Path;

static WALLET_ACTOR: OnceCell<ActorRef<WalletMessage>> = OnceCell::new();

pub async fn init(storage_path: Option<impl AsRef<Path>>) {
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
    // loop to make sure the runtime has been initialized before sending messages
    loop {
        if let Some(actor) = WALLET_ACTOR.get() {
            match dispatch(actor, message.clone()).await {
                Ok(response) => {
                    return response.unwrap_or("".to_string());
                }
                Err(e) => {
                    return format!(r#"{{ "type": "error", "payload": "{}" }}"#, e);
                }
            }
        }
    }
}
