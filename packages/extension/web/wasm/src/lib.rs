
#[macro_use]
pub mod noise_xx;
pub mod utils;

use wasm_bindgen::prelude::*;
use crate::noise_xx::{
    noisesession::NoiseSession,
    consts::{MAC_LENGTH},
};

use once_cell::sync::Lazy;
use std::sync::Mutex;
use std::str;

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

const MSG_A:u8 = 0;
const _MSG_B:u8 = 1;
const MSG_C:u8 = 2;
const MSG_REGULAR:u8 = 3;

static SESSION: Lazy<Mutex<NoiseSession>> = Lazy::new(|| {
    let prologue = vec![120, 120]; // xx
    let kp = utils::gen_keys().unwrap();
    let is_initiator = true;
    let mut sess = NoiseSession::init_session(is_initiator, &prologue[..], kp);
    let ephemeral = utils::gen_keys().unwrap();
    sess.set_ephemeral_keypair(ephemeral);
    Mutex::new(sess)
});

#[wasm_bindgen]
pub fn a_message() -> String {
    let mut msg = utils::a_msg("message_a_plaintext");
    let mut session = SESSION.lock().unwrap();
    match session.send_message(&mut msg[..]) {
        Ok(v)=> (),//console_log!("WASM=> send a msg OK"),
        Err(e)=> console_log!("WASM=> send a msg ERR {:?}", e.to_string()),
    };
    msg.insert(0, MSG_A); // mark it as "a"
    hex::encode(msg)
}

#[wasm_bindgen]
pub fn c_message() -> String {
    let mut msg = utils::c_msg("message_c_plaintext");
    let mut session = SESSION.lock().unwrap();
    match session.send_message(&mut msg[..]) {
        Ok(v)=> (),//console_log!("WASM=> send c msg OK"),
        Err(e)=> console_log!("WASM=> send c msg ERR {:?}", e.to_string()),
    };
    msg.insert(0, MSG_C); // mark it as "c"
    hex::encode(msg)
}

#[wasm_bindgen]
pub fn receive_b_message(hexmsg: &str)  {
    if let Ok(mut msg) = hex::decode(hexmsg) {
        msg.remove(0); // remove the marker
        let mut session = SESSION.lock().unwrap();
        match session.recv_message(&mut msg.clone()[..]) {
            Ok(v)=> (),//console_log!("WASM=> received b msg OK {:?}",session.get_message_count()),
            Err(e)=> console_log!("WASM=> received b msg ERR {:?}", e.to_string()),
        };
    }
}

#[wasm_bindgen]
pub fn make_message(content: &str) -> String {
    let mut msg = utils::make_msg(content);
    let mut session = SESSION.lock().unwrap();
    match session.send_message(&mut msg[..]) {
        Ok(v)=> (),//console_log!("WASM=> make msg OK"),
        Err(e)=> console_log!("WASM=> make msg ERR {:?}", e.to_string()),
    }
    msg.insert(0, MSG_REGULAR); // mark it as "regular"
    hex::encode(msg)
}

#[wasm_bindgen]
pub fn receive_message(hexmsg: &str) -> String {
    if let Ok(mut msg) = hex::decode(hexmsg) {
        msg.remove(0); // remove the marker
        let mut session = SESSION.lock().unwrap();

        let mut enc = msg.clone();
        match session.recv_message(&mut enc[..]) {
            Ok(v)=> (),//println!("got msg OK"),
            Err(e)=>println!("got msg ERR {:?}",e.to_string()),
        };

        let dec = &enc[0..enc.len() - MAC_LENGTH]; // drop the mac
        // console_log!("WASM=> DECRYPTED: {:?}",str::from_utf8(&dec[..]));
        return match str::from_utf8(&dec[..]) {
            Ok(v)=> v.to_string(),
            Err(e)=> {
                console_log!("WASM=> ERROR DECRYPTING {:?}", e.to_string());
                return "".to_string()
            }
        }
    }
    "".to_string()
}
