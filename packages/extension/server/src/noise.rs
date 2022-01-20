use crate::noise_xx::{
  consts::{DHLEN, MAC_LENGTH},
  error::NoiseError,
  noisesession::NoiseSession,
  types::{Keypair, PrivateKey},
};
use rand::Rng;
use std::str;

pub const MSG_A:u8 = 0;
pub const MSG_B:u8 = 1;
pub const MSG_C:u8 = 2;
pub const MSG_REGULAR:u8 = 3; // d...

pub struct Noise {
  session: NoiseSession,
}

impl Noise {

  pub fn new() -> Self {
    let prologue = vec![120, 120]; // xx
    let kp = gen_keys();
    let is_initiator = false;
    let mut sess = NoiseSession::init_session(is_initiator, &prologue[..], kp);
    let ephemeral = gen_keys();
    sess.set_ephemeral_keypair(ephemeral);
    Noise {
      session: sess
    }
  }

  pub fn get_message(&mut self, hexmsg: &str, c_response_plaintext: Option<&str>) -> Result<(bool,String), NoiseError> {
    match hex::decode(hexmsg) {
      Ok(msg) => {
        if msg[0] == MSG_A {
          self.receive_a(msg)
        } else if msg[0] == MSG_C {
          self.receive_c(msg, c_response_plaintext)
        } else if msg[0] == MSG_REGULAR {
          self.receive_message(msg)
        } else {
          Err(NoiseError::InvalidInputError)
        }
      },
      Err(_e)=> Err(NoiseError::InvalidInputError)
    }
  }

  pub fn receive_a(&mut self, mut msg: Vec<u8>) -> Result<(bool,String), NoiseError> {
    msg.remove(0); // remove the marker

    match self.session.recv_message(&mut msg.clone()[..]) {
      Ok(_v)=> (),//println!("received a msg OK"),
      Err(e)=>println!("received a msg ERR {:?}",e.to_string()),
    };

    let mut msg2 = b_msg("message_b_plaintext");
    match self.session.send_message(&mut msg2[..]) {
      Ok(_v)=> (),//println!("send b msg OK"),
      Err(e)=>println!("send b msg ERR {:?}",e.to_string()),
    };
    msg2.insert(0, MSG_B); // mark it as "response"
    Ok((true,hex::encode(msg2)))
  }

  pub fn receive_c(&mut self, mut msg: Vec<u8>, response_plaintext: Option<&str>) -> Result<(bool,String), NoiseError> {
    msg.remove(0); // remove the marker

    match self.session.recv_message(&mut msg.clone()[..]) {
      Ok(_v)=> (),//println!("received c msg OK"),
      Err(e)=>println!("received c msg ERR {:?}",e.to_string()),
    };

    let mut plain = "ready_for_communication";
    if let Some(p) = response_plaintext {
      plain = p;
    }
    let mut msg2 = make_msg(plain);
    match self.session.send_message(&mut msg2[..]) {
      Ok(_v)=> (),//println!("send regular msg OK"),
      Err(e)=>println!("send regular msg ERR {:?}",e.to_string()),
    };
    msg2.insert(0, MSG_REGULAR); // mark it as "regular"
    Ok((true,hex::encode(msg2)))
  }

  pub fn receive_message(&mut self, mut msg: Vec<u8>) -> Result<(bool,String), NoiseError> {
    msg.remove(0); // remove the marker

    let mut enc = msg.clone();
    match self.session.recv_message(&mut enc[..]) {
      Ok(_v)=> (),//println!("got msg OK"),
      Err(e)=>println!("got msg ERR {:?}",e.to_string()),
    };

    let dec = &enc[0..enc.len() - MAC_LENGTH]; // drop the mac
    let ret = match str::from_utf8(&dec[..]) {
      Ok(v) => v.to_string(),
      Err(e) => e.to_string(),
    };
    Ok((false,ret))
  }

  pub fn make_message(&mut self, content: &str) -> String {
    let mut msg = make_msg(content);

    match self.session.send_message(&mut msg[..]) {
        Ok(_v)=> (), //println!("make msg OK"),
        Err(e)=> println!("make msg ERR {:?}", e.to_string()),
    }
    msg.insert(0, MSG_REGULAR); // mark it as "regular"
    hex::encode(msg)
  }

}

pub fn gen_keys() -> Keypair {
  let random_bytes = rand::thread_rng().gen::<[u8; 32]>();
  let key = PrivateKey::from_bytes(random_bytes);
  Keypair::from_private_key(key).unwrap()
}

// msg lengths defined here
// https://source.symbolic.software/noiseexplorer/noiseexplorer/-/blob/cc63248c9fde6b256ad630e93771ae17a76e5a96/implementations/rs/XX/tests/handshake.rs

pub fn _a_msg(s: &str) -> Vec<u8> {
  let mut message: Vec<u8> = Vec::new();
  message.extend_from_slice(&[0u8; DHLEN][..]);
  message.extend_from_slice(&s.as_bytes()[..]);
  message
}

pub fn b_msg(s: &str) -> Vec<u8> {
  let mut message: Vec<u8> = Vec::new();
  message.extend_from_slice(&[0u8; DHLEN][..]);
  message.extend_from_slice(&[0u8; DHLEN + MAC_LENGTH][..]);
  message.extend_from_slice(&s.as_bytes()[..]);
  message.extend_from_slice(&[0u8; MAC_LENGTH][..]);
  message
}

pub fn _c_msg(s: &str) -> Vec<u8> {
  let mut message: Vec<u8> = Vec::new();
  message.extend_from_slice(&[0u8; DHLEN + MAC_LENGTH][..]);
  message.extend_from_slice(&s.as_bytes()[..]);
  message.extend_from_slice(&[0u8; MAC_LENGTH][..]);
  message
}

pub fn make_msg(s: &str) -> Vec<u8> {
  let mut message: Vec<u8> = Vec::new();
  message.extend_from_slice(&s.as_bytes()[..]);
  message.extend_from_slice(&[0u8; MAC_LENGTH][..]);
  message
}

pub fn _test_handshake() {
  let prologue = vec![120, 120]; // xx
  let kp = gen_keys();
  let mut initiator_session: NoiseSession = NoiseSession::init_session(true, &prologue[..], kp);
  initiator_session.set_ephemeral_keypair(gen_keys());

  let kp2 = gen_keys();
  let mut responder_session: NoiseSession = NoiseSession::init_session(false, &prologue[..], kp2);
  responder_session.set_ephemeral_keypair(gen_keys());

  // A
  let mut msg = _a_msg("message_a_plaintext");
  // println!("{:?}",str::from_utf8(&msg[..]));
  initiator_session.send_message(&mut msg[..]).unwrap();
  responder_session
    .recv_message(&mut msg.clone()[..]).unwrap();

  // B
  let mut msg2 = b_msg("message_b_plaintext");
  responder_session.send_message(&mut msg2[..]).unwrap();
  initiator_session
    .recv_message(&mut msg2.clone()[..]).unwrap();

  // C
  let mut msg = _c_msg("message_c_plaintext");
  // println!("{:?}",str::from_utf8(&msg[..]));
  initiator_session.send_message(&mut msg[..]).unwrap();
  responder_session
    .recv_message(&mut msg.clone()[..])
    .unwrap();
    
  // SEND MSG
  let text = "hello world";
  println!("MESSAGE: {}", text);
  let mut m = make_msg(text);
  initiator_session.send_message(&mut m[..]).unwrap();
  let mut enc = m.clone();
  responder_session.recv_message(&mut enc[..]).unwrap();
  let dec = &enc[0..enc.len() - MAC_LENGTH]; // drop the mac
  println!("DECRYPTED: {:?}", str::from_utf8(&dec[..]));
}
