use chronicle_common::launcher;
use log::*;

mod actors;
use actors::{dispatch, WalletAppBuilder};

use std::path::Path;

launcher!(
    apps_builder: AppsBuilder {wallet: WalletAppBuilder}, // Apps
    apps: Apps {} // Launcher state
);

// build your apps
impl AppsBuilder {
    fn build(self) -> Apps {
        let wallet_app = WalletAppBuilder::new();
        self.wallet(wallet_app).to_apps()
    }
}

pub async fn init(storage_path: Option<impl AsRef<Path>>) {
    println!("Starting runtime");
    if let Some(path) = storage_path {
        iota_wallet_actor::wallet::storage::set_storage_path(path)
            .expect("failed to set storage path");
    }
    AppsBuilder::new()
        .build() // build apps first, then start them in order you want.
        .wallet()
        .await // start app
        .one_for_one()
        .await;
}

pub async fn send_message(message: String) -> String {
    // loop to make sure the runtime has been initialized before sending messages
    loop {
        match dispatch(message.clone()).await {
            Ok(response) => {
                return response.unwrap_or("".to_string());
            }
            Err(e) => {
                if e != "actor tx not initialized" {
                    return format!(r#"{{ "type": "error", "payload": "{}" }}"#, e);
                }
            }
        }
    }
}
