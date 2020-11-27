pub use iota_wallet::{
  actor::{
    Message as WalletMessage, MessageType as WalletMessageType, Response, ResponseType,
    WalletMessageHandler,
  },
  WalletError,
};
use riker::actors::*;
use serde::Deserialize;
use tokio::{runtime::Runtime, sync::mpsc::unbounded_channel};

use std::path::PathBuf;
use std::time::Duration;

const POLLING_INTERVAL_MS: u64 = 30_000;

pub struct WalletActor {
  wallet_message_handler: WalletMessageHandler,
  runtime: Runtime,
}

impl WalletActor {
  /// Starts the polling mechanism.
  pub fn set_polling_interval(&mut self, interval_ms: u64) -> &Self {
    self
      .wallet_message_handler
      .set_polling_interval(Duration::from_millis(interval_ms));
    self
  }
}

impl ActorFactoryArgs<PathBuf> for WalletActor {
  fn create_args(storage_path: PathBuf) -> Self {
    let mut actor = Self {
      wallet_message_handler: WalletMessageHandler::with_storage_path(storage_path)
        .expect("failed to initialise account manager"),
      runtime: Runtime::new().expect("failed to create tokio runtime"),
    };
    actor.set_polling_interval(POLLING_INTERVAL_MS);
    actor
  }
}

impl Default for WalletActor {
  fn default() -> Self {
    let mut actor = Self {
      wallet_message_handler: Default::default(),
      runtime: Runtime::new().expect("failed to create tokio runtime"),
    };
    actor.set_polling_interval(POLLING_INTERVAL_MS);
    actor
  }
}

impl Actor for WalletActor {
  type Msg = WalletMessage;

  fn recv(&mut self, _ctx: &Context<Self::Msg>, msg: Self::Msg, _sender: Sender) {
    let wallet_message_handler = &mut self.wallet_message_handler;
    self.runtime.block_on(async move {
      wallet_message_handler.handle(msg).await;
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
