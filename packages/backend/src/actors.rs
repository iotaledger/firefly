pub use iota_wallet::{
    account_manager::AccountManager,
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

use std::{path::PathBuf, sync::Arc, time::Duration};

const POLLING_INTERVAL_MS: u64 = 30_000;

pub struct WalletActor {
    wallet_message_handler: Arc<Mutex<WalletMessageHandler>>,
    runtime: Runtime,
}

impl ActorFactoryArgs<PathBuf> for WalletActor {
    fn create_args(storage_path: PathBuf) -> Self {
        let mut runtime = Runtime::new().expect("failed to create tokio runtime");
        Self {
            wallet_message_handler: Arc::new(Mutex::new(
                WalletMessageHandler::with_manager(
                    runtime
                        .block_on(
                            AccountManager::builder()
                                .with_storage_path(storage_path)
                                .with_polling_interval(Duration::from_millis(POLLING_INTERVAL_MS))
                                .finish(),
                        )
                        .unwrap(),
                )
                .unwrap(),
            )),
            runtime,
        }
    }
}

impl Default for WalletActor {
    fn default() -> Self {
        let mut runtime = Runtime::new().expect("failed to create tokio runtime");
        Self {
            wallet_message_handler: Arc::new(Mutex::new(
                runtime.block_on(WalletMessageHandler::new()).unwrap(),
            )),
            runtime,
        }
    }
}

impl Actor for WalletActor {
    type Msg = WalletMessage;

    fn recv(&mut self, _ctx: &Context<Self::Msg>, msg: Self::Msg, _sender: Sender) {
        let wallet_message_handler = self.wallet_message_handler.clone();
        self.runtime.enter(move || {
            tokio::task::spawn(async move {
                let mut wallet_message_handler = wallet_message_handler.lock().await;
                wallet_message_handler.handle(msg).await;
            });
        });
    }
}

#[derive(Deserialize)]
struct DispatchMessage {
    id: String,
    #[serde(flatten)]
    message: WalletMessageType,
}

pub(crate) async fn dispatch(
    wallet_actor: &ActorRef<WalletMessage>,
    message: String,
) -> Result<Option<String>, String> {
    let (response_tx, mut response_rx) = unbounded_channel();
    let message: DispatchMessage = serde_json::from_str(&message)
        .map_err(|e| serde_json::to_string(&ResponseType::Error(e.into())).unwrap())?;

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
