use serde::{ser::Serializer, Deserialize, Serialize};
use std::fmt::Debug;
use std::clone::Clone;
use iota_wallet::{
    account::{AccountIdentifier, AccountBalance},
    actor::{AccountMethod, MessageType as WalletMessageType, ResponseType as WalletResponseType, AccountDto},
    message::{TransferBuilder, Message as WalletMessage},
};
use tokio::sync::{
    mpsc::UnboundedSender
};

pub type Result<T> = std::result::Result<T, ExtensionError>;

#[derive(Debug, Clone, thiserror::Error)]
pub enum ExtensionError {
    #[error("`{0}`")]
    GeneralError(String),
    #[error("`{0}`")]
    MessageError(String),
    #[error("`{0}`")]
    ServerError(String),
    #[error("`{0}`")]
    NoiseError(String),
}

impl From<std::io::Error> for ExtensionError {
    fn from(err: std::io::Error) -> Self {
        ExtensionError::GeneralError(err.to_string())
    }
}

/// The actor response type.
#[derive(Serialize, Debug)]
pub struct Response {
    pub id: String,
    #[serde(flatten)]
    pub response: ResponseType,
    pub action: MessageType,
}

impl Response {
    /// Creates a new response.
    pub fn new<S: Into<String>>(id: S, action: MessageType, response: ResponseType) -> Self {
        Self {
            id: id.into(),
            response,
            action,
        }
    }
    /// The response's type.
    pub fn response(&self) -> &ResponseType {
        &self.response
    }
}

/// The actor Message type.
#[derive(Debug, Clone)]
pub struct Message {
    pub id: String,
    pub(crate) message_type: MessageType,
    pub(crate) response_tx: UnboundedSender<Response>,
}

/// The messages that can be sent to the actor.
#[derive(Clone, Debug, Deserialize)]
#[serde(tag = "cmd", content = "payload")]
pub enum MessageType {
    GetAccount(AccountIdentifier),
    CallAccountMethod {
        /// The account identifier.
        #[serde(rename = "accountId")]
        account_id: AccountIdentifier,
        /// The account method to call.
        method: AccountMethod,
    },
    SendTransfer {
        /// The account identifier.
        #[serde(rename = "accountId")]
        account_id: AccountIdentifier,
        /// The transfer details.
        transfer: Box<TransferBuilder>,
    },
    CallGlow {
        /// The method name
        method: String,
        /// An optional payload
        payload: Option<String>,
    },
    Empty,
    GetAccounts,
}

impl From<WalletMessageType> for MessageType {
    fn from(msg: WalletMessageType) -> Self {
        if let WalletMessageType::GetAccount(account_id) = msg {
            return MessageType::GetAccount(account_id)
        }
        if let WalletMessageType::CallAccountMethod{account_id, method} = msg {
            return MessageType::CallAccountMethod{account_id, method}
        }
        if let WalletMessageType::SendTransfer{account_id, transfer} = msg {
            return MessageType::SendTransfer{account_id, transfer}
        }
        // if let WalletMessageType::CallGlow{plugin, method, payload} = msg {
        //     return MessageType::CallGlow{coin, method, payload}
        // }
        if let WalletMessageType::GetAccounts = msg {
            return MessageType::GetAccounts
        }
        MessageType::Empty
    }
}

// #[derive(Clone, Debug, Deserialize)]
// pub struct Transfer {
//     address: String,
//     amount: u64,
// }

/// The response message.
#[derive(Serialize, Debug)]
#[serde(tag = "type", content = "payload")]
pub enum ResponseType { // NOTE: this is for the ExtensionResponse
    ReadAccount(AccountDto),
    ReadAccounts(Vec<AccountDto>),
    Balance(AccountBalance),
    SentTransfer(WalletMessage),
    Error(String),
    CalledGlow(String),
}

impl From<WalletResponseType> for ResponseType {
    fn from(res: WalletResponseType) -> Self {
        if let WalletResponseType::ReadAccount(account) = res {
            return ResponseType::ReadAccount(account)
        }
        if let WalletResponseType::ReadAccounts(accounts) = res {
            return ResponseType::ReadAccounts(accounts)
        }
        if let WalletResponseType::Balance(bal) = res {
            return ResponseType::Balance(bal)
        }
        if let WalletResponseType::SentTransfer(tx) = res {
            return ResponseType::SentTransfer(tx)
        }
        if let WalletResponseType::Error(err) = res {
            return ResponseType::Error(err.to_string())
        }
        // if let WalletResponseType::CalledGlow(plugin) = res {
        //     return ResponseType::CalledGlow(plugin)
        // }
        ResponseType::Error("did not recognize response".to_string())
    }
}

impl Serialize for MessageType {
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        match self {
            MessageType::GetAccount(_) => {
                serializer.serialize_unit_variant("MessageType", 0, "GetAccount")
            },
            MessageType::CallAccountMethod {
                account_id: _,
                method: _,
            } => serializer.serialize_unit_variant("MessageType", 1, "CallAccountMethod"),
            MessageType::SendTransfer {
                account_id: _,
                transfer: _,
            } => {
                serializer.serialize_unit_variant("MessageType", 2, "SendTransfer")
            },
            MessageType::CallGlow {
                method: _,
                payload: _,
            } => serializer.serialize_unit_variant("MessageType", 3, "CallGlow"),
            MessageType::Empty=> serializer.serialize_unit_variant("MessageType", 4, "CallGlow"),
            MessageType::GetAccounts=> serializer.serialize_unit_variant("MessageType", 5, "GetAccounts"),
        }
    }
}

impl Message {
    /// Creates a new instance of a Message.
    pub fn new<S: Into<String>>(id: S, message_type: MessageType, response_tx: UnboundedSender<Response>) -> Self {
        Self {
            id: id.into(),
            message_type,
            response_tx,
        }
    }

    /// The message type.
    pub fn message_type(&self) -> &MessageType {
        &self.message_type
    }

    /// The response sender.
    pub fn response_tx(&self) -> &UnboundedSender<Response> {
        &self.response_tx
    }

    /// The message identifier.
    pub fn id(&self) -> &String {
        &self.id
    }
}

#[derive(Deserialize)]
pub struct DispatchMessage {
    #[serde(rename = "actorId")]
    pub actor_id: String,
    pub id: String,
    #[serde(flatten)]
    pub message: MessageType,
}

/// Callback from socket server
#[derive(Debug)]
pub struct CallbackMessage {
    pub payload: Result<String>,
    pub response_tx: UnboundedSender<String>,
}
