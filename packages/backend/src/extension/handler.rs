use crate::extension::message::{DispatchMessage, ExtensionError, MessageType, Response, ResponseType, Result};

pub fn translate_message(msg: &str) -> (Result<String>, bool) {
    println!("MSG: {:?}", msg);
    match serde_json::from_str::<DispatchMessage>(msg) {
        Ok(v) => {
            // println!("DECRYPTED MSG: {:?}", v.message);
            let mut final_message: String = "".to_string();

            let m = v.message.clone();
            // Here we can validate which messages the extension is allowed to send
            match v.message {
                MessageType::GetAccount(_id) => {
                    final_message = msg.to_string();
                }
                MessageType::GetAccounts => {
                    final_message = msg.to_string();
                }
                MessageType::CallAccountMethod {
                    account_id: _account_id,
                    method: _method,
                } => {
                    final_message = msg.to_string();
                }
                MessageType::SendTransfer {
                    account_id: _account_id,
                    transfer: _transfer,
                } => {
                    final_message = msg.to_string();
                }
                MessageType::CallGlow { method, payload: _ } => {
                    // handle Glow messages here
                    // like storing metadata in Stronghold?
                    if method == "CheckLink" {
                        println!("=> Handler CheckLink");
                        let res = serde_json::to_string(&Response::new(
                            v.id,
                            m,
                            ResponseType::CalledGlow("INITIALIZED".to_string()),
                        ))
                        .unwrap();
                        return (Ok(res), true);
                    }
                }
                MessageType::Empty => (),
            }
            if final_message.len() == 0 {
                return (Err(ExtensionError::MessageError("wrong type".to_string())), false);
            }
            (Ok(final_message), false) // return here!
        }
        Err(e) => {
            println!("[translate] ERROR: {:?}", e.to_string());
            (Err(ExtensionError::MessageError(e.to_string())), false)
        }
    }
}
