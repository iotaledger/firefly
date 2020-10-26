pub use iota_wallet_actor::{
  Message as WalletMessage, MessageType as WalletMessageType, WalletMessageHandler,
};
use riker::actors::*;
use tokio::{runtime::Runtime, sync::mpsc::unbounded_channel};

pub struct WalletActor {
  wallet_message_handler: WalletMessageHandler,
  runtime: Runtime,
}

impl Default for WalletActor {
  fn default() -> Self {
    Self {
      wallet_message_handler: Default::default(),
      runtime: Runtime::new().expect("failed to create tokio runtime"),
    }
  }
}

impl Actor for WalletActor {
  type Msg = WalletMessage;

  fn recv(&mut self, _ctx: &Context<Self::Msg>, msg: Self::Msg, _sender: Sender) {
    let wallet_message_handler = &self.wallet_message_handler;
    self.runtime.block_on(async move {
      wallet_message_handler.handle(msg).await;
    });
  }
}

pub(crate) async fn dispatch(
  wallet_actor: &ActorRef<WalletMessage>,
  message: String,
) -> Result<Option<String>, String> {
  let (response_tx, mut response_rx) = unbounded_channel();
  let message: WalletMessageType = serde_json::from_str(&message).map_err(|e| e.to_string())?;
  wallet_actor.tell(WalletMessage::new(message, response_tx), None);
  let response = response_rx.recv().await;
  match response {
    Some(res) => Ok(Some(
      serde_json::to_string(&res).map_err(|e| e.to_string())?,
    )),
    None => Ok(None),
  }
}
