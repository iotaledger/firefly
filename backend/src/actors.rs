use iota_wallet_actor::{
  Message as WalletMessage, MessageType as WalletMessageType, WalletBuilder,
};
use once_cell::sync::OnceCell;
use tokio::sync::mpsc::{unbounded_channel, UnboundedSender};

static WALLET_TX: OnceCell<UnboundedSender<WalletMessage>> = OnceCell::new();

use chronicle_common::app;

app!(WalletAppBuilder {});

impl WalletAppBuilder {
  pub fn build(self) -> WalletApp {
    WalletApp {}
  }
}

pub struct WalletApp;

impl WalletApp {
  pub async fn run(self) {
    let (wallet_tx, wallet_rx) = unbounded_channel();
    let wallet = WalletBuilder::new().rx(wallet_rx).build();
    WALLET_TX
      .set(wallet_tx)
      .expect("failed to set wallet actor tx");

    tokio::spawn(wallet.run());
  }
}

pub(crate) async fn dispatch(message: String) -> Result<Option<String>, String> {
  if let Some(actor_tx) = WALLET_TX.get() {
    let (response_tx, mut response_rx) = unbounded_channel();
    let message: WalletMessageType = serde_json::from_str(&message).map_err(|e| e.to_string())?;
    actor_tx
      .send(WalletMessage::new(message, response_tx))
      .map_err(|e| e.to_string())?;
    let response = response_rx.recv().await;
    match response {
      Some(res) => Ok(Some(
        serde_json::to_string(&res).map_err(|e| e.to_string())?,
      )),
      None => Ok(None),
    }
  } else {
    Err("actor tx not initialized".to_string())
  }
}
