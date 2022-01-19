use crate::{
    actor::{
        event::{EventListener},
        message::{KillMessage},
    },
    RUNTIME,
};

pub use iota_wallet::{
    account_manager::{AccountManager, DEFAULT_STORAGE_FOLDER},
    actor::{Message as WalletMessage, MessageType as WalletMessageType, Response, ResponseType, WalletMessageHandler},
    Error,
};

use riker::actors::*;

use std::sync::Arc;

#[actor(WalletMessage, KillMessage)]
pub struct WalletActor {
    handler: Arc<WalletMessageHandler>,
}

pub(crate) struct WalletActorData {
    pub listeners: Vec<EventListener>,
    pub actor: ActorRef<WalletActorMsg>,
}

impl Default for WalletActor {
    fn default() -> Self {
        let handler = Arc::new(RUNTIME.block_on(async move {
            WalletMessageHandler::with_manager(
                AccountManager::builder()
                    .with_storage(DEFAULT_STORAGE_FOLDER, None)
                    .unwrap() // safe to unwrap, the storage password is None ^
                    .with_skip_polling()
                    .finish()
                    .await
                    .unwrap(),
            )
        }));
        Self { handler }
    }
}

impl Actor for WalletActor {
    type Msg = WalletActorMsg;

    fn recv(&mut self, ctx: &Context<Self::Msg>, msg: Self::Msg, sender: Sender) {
        self.receive(ctx, msg, sender)
    }
}

impl ActorFactoryArgs<AccountManager> for WalletActor {
    fn create_args(manager: AccountManager) -> Self {
        Self {
            handler: Arc::new(WalletMessageHandler::with_manager(manager)),
        }
    }
}

impl Receive<KillMessage> for WalletActor {
    type Msg = WalletActorMsg;

    fn receive(&mut self, ctx: &Context<Self::Msg>, _msg: KillMessage, _sender: Sender) {
        ctx.stop(ctx.myself());
    }
}

impl Receive<WalletMessage> for WalletActor {
    type Msg = WalletActorMsg;

    fn receive(&mut self, _ctx: &Context<Self::Msg>, msg: WalletMessage, _sender: Sender) {
        let wallet_message_handler = self.handler.clone();
        RUNTIME.spawn(async move {
            wallet_message_handler.handle(msg).await;
        });
    }
}
