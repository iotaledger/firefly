# glow.rs

Glow.rs manages a noise-encrypted websocket server, built to forward messages to and from wallet.rs. It can be integrated with a wallet.rs application using Riker.

**usage example:**
```rust
use glow::{
    handler::{ExtensionHandler,translate_message},
    message::{
        Result as ExtensionResult,
        Message as ExtensionMessage,
        CallbackMessage,
    },
};

pub struct ExtensionActor {
    runtime: Runtime,
    handler: Arc<Mutex<ExtensionHandler>>,
}

impl Actor for ExtensionActor {
    type Msg = ExtensionMessage;

    // FROM FIREFLY
    fn recv(&mut self, _ctx: &Context<Self::Msg>, msg: Self::Msg, _sender: Sender) {
        let message_handler = self.handler.clone();
        self.runtime.spawn(async move {
            let mut message_handler = message_handler.lock().await;
            message_handler.receive(msg).await;
        });
    }
}

// FROM GLOW
async fn callback(m: String) -> ExtensionResult<String> {
    println!("OY OY {:?}", m);
    translate_message(m.as_str()).await
    // dispatch to WalletActor and return result
}

impl Default for ExtensionActor {
    fn default() -> Self {
        let run = Runtime::new().expect("failed to create tokio runtime");
        let (tx, mut rx): (UnboundedSender<CallbackMessage>, UnboundedReceiver<CallbackMessage>) = unbounded_channel();

        run.spawn(async move {
            while let Some(r) = rx.recv().await {
                if let Ok(s) = r.payload {
                    let res = callback(s).await;
                    if let Ok(payload) = res {
                        let _ = r.response_tx.send(payload);
                    }
                }
            }
        });

        let (quit_sender, quit_receiver): (BroadcastSender<()>, Receiver<()>) = channel(1);

        Self {
            runtime: run,
            handler: Arc::new(Mutex::new(ExtensionHandler{
                sender: tx,
                quit: Arc::new(Mutex::new(quit_receiver)),
                quit_sender: quit_sender,
            })),
        }
    }
}
```