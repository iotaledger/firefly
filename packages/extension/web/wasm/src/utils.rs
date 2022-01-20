
use crate::noise_xx::{
    consts::{DHLEN, MAC_LENGTH},
    error::NoiseError,
    types::{Keypair, PrivateKey},
};

pub fn gen_keys() -> Result<Keypair, NoiseError> {

    let window = web_sys::window().unwrap();
    let crypto = window.crypto().unwrap();

    let mut random = [0_u8; DHLEN];
    crypto.get_random_values_with_u8_array(&mut random).unwrap();

    let key = PrivateKey::from_bytes(random);

    Keypair::from_private_key(key)
}

pub fn a_msg(s: &str) -> Vec<u8> {
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

pub fn c_msg(s: &str) -> Vec<u8> {
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
