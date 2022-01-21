use iota_wallet::event::EventId;

use serde::{Deserialize, Serialize};

use std::convert::TryFrom;

pub type EventListener = (EventId, EventType);

#[repr(C)]
#[derive(Serialize, Deserialize, Copy, Clone)]
pub enum EventType {
    ErrorThrown,
    BalanceChange,
    NewTransaction,
    ConfirmationStateChange,
    Reattachment,
    Broadcast,
    StrongholdStatusChange,
    TransferProgress,
    LedgerAddressGeneration,
    MigrationProgress,
}

impl TryFrom<&str> for EventType {
    type Error = String;

    fn try_from(value: &str) -> Result<Self, Self::Error> {
        let event_type = match value {
            "ErrorThrown" => EventType::ErrorThrown,
            "BalanceChange" => EventType::BalanceChange,
            "NewTransaction" => EventType::NewTransaction,
            "ConfirmationStateChange" => EventType::ConfirmationStateChange,
            "Reattachment" => EventType::Reattachment,
            "Broadcast" => EventType::Broadcast,
            "StrongholdStatusChange" => EventType::StrongholdStatusChange,
            "TransferProgress" => EventType::TransferProgress,
            "LedgerAddressGeneration" => EventType::LedgerAddressGeneration,
            "MigrationProgress" => EventType::MigrationProgress,
            _ => return Err(format!("invalid event name {}", value)),
        };
        Ok(event_type)
    }
}

#[derive(Serialize)]
struct EventResponse<T: Serialize> {
    id: String,
    #[serde(rename = "type")]
    _type: EventType,
    payload: T,
}

impl<T: Serialize> EventResponse<T> {
    fn new<S: Into<String>>(id: S, event: EventType, payload: T) -> Self {
        Self {
            id: id.into(),
            _type: event,
            payload,
        }
    }
}

pub(crate) fn serialize_event<T: Serialize, S: Into<String>>(id: S, event: EventType, payload: T) -> String {
    serde_json::to_string(&EventResponse::new(id, event, payload)).unwrap()
}
