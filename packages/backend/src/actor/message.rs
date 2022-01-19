use iota_wallet::{
    actor::{MessageType},
};

use serde::{Deserialize};

use std::{
    sync::{mpsc::Sender, Arc, Mutex},
};

pub(crate) type MessageReceiver = Arc<Mutex<Sender<String>>>;

#[derive(Deserialize, Clone)]
pub(crate) struct DispatchMessage {
    #[serde(rename = "actorId")]
    pub(crate) actor_id: String,
    pub(crate) id: String,
    #[serde(flatten)]
    pub(crate) message: MessageType,
}

#[derive(Deserialize)]
pub(crate) struct FallbackMessage {
    #[serde(rename = "actorId")]
    pub(crate) actor_id: String,
    pub(crate) id: Option<String>,
}

#[derive(Clone, Debug)]
pub struct KillMessage;
