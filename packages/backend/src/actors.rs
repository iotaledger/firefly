pub use iota_wallet::{
    account_manager::{AccountManager, DEFAULT_STORAGE_FOLDER},
    actor::{
        Message as WalletMessage, MessageType as WalletMessageType, Response, ResponseType,
        WalletMessageHandler,
    },
    Error,
};
use riker::actors::*;

use super::RUNTIME;
use std::{sync::Arc, time::Duration};
#[derive(Clone, Debug)]
pub struct KillMessage;

#[actor(WalletMessage, KillMessage)]
pub struct WalletActor {
    wallet_message_handler: Arc<WalletMessageHandler>,
}

impl ActorFactoryArgs<AccountManager> for WalletActor {
    fn create_args(manager: AccountManager) -> Self {
        Self {
            wallet_message_handler: Arc::new(WalletMessageHandler::with_manager(manager)),
        }
    }
}

impl Default for WalletActor {
    fn default() -> Self {
        let wallet_message_handler = Arc::new(RUNTIME.block_on(async move {
            WalletMessageHandler::with_manager(
                AccountManager::builder()
                    .with_storage(DEFAULT_STORAGE_FOLDER, None)
                    .unwrap() //safe to unwrap, the storage password is None ^
                    .with_polling_interval(Duration::from_millis(crate::POLLING_INTERVAL_MS))
                    .finish()
                    .await
                    .unwrap(),
            )
        }));
        Self {
            wallet_message_handler,
        }
    }
}

impl Actor for WalletActor {
    type Msg = WalletActorMsg;

    fn recv(&mut self, ctx: &Context<Self::Msg>, msg: Self::Msg, sender: Sender) {
        self.receive(ctx, msg, sender)
    }
}

impl Receive<WalletMessage> for WalletActor {
    type Msg = WalletActorMsg;

    fn receive(&mut self, _ctx: &Context<Self::Msg>, msg: WalletMessage, _sender: Sender) {
        let wallet_message_handler = self.wallet_message_handler.clone();
        RUNTIME.spawn(async move {
            wallet_message_handler.handle(msg).await;
        });
    }
}

impl Receive<KillMessage> for WalletActor {
    type Msg = WalletActorMsg;

    fn receive(&mut self, ctx: &Context<Self::Msg>, _msg: KillMessage, _sender: Sender) {
        ctx.stop(ctx.myself());
    }
}
