use crate::{
    message::{Result,CallbackMessage},
};
use crate::server;
use tokio::{
    sync::{
        mpsc::UnboundedSender,
        broadcast::{Receiver, Sender},
        Mutex
    }
};
use std::sync::Arc;

pub struct ExtensionHandler {
    pub sender: UnboundedSender<CallbackMessage>,
    pub quit: Arc<Mutex<Receiver<()>>>,
    pub quit_sender: Sender<()>,
    pub event_receiver: Arc<Mutex<Receiver<String>>>,
    pub event_sender: Sender<String>,
    pub initialized: bool,
}

impl ExtensionHandler {
    pub async fn receive_glow(&mut self, method: &String, payload: &Option<String>) -> Result<String> {
        let s = self.sender.clone();
        let quit = self.quit.clone();
        let quit_sender = self.quit_sender.clone();
        let event_receiver = self.event_receiver.clone();

        if method=="Start" {
            if let Some(profile) = payload {
                let p = profile.clone();
                tokio::spawn(async move {
                    println!("==> start server");
                    let _ = server::start(s, quit, event_receiver, p).await;
                    println!("===> stop server");
                });
            }
        } else if method=="Stop" {
            println!("=> CallGlow: Stop");
            let _ = quit_sender.send(());
            self.initialized = false;
        } else if method=="Initialize" {
            println!("=> CallGlow: Initialize");
            self.initialized = true;
        } else if method=="CheckLink" {
            println!("=> CallGlow, method: {:?}", method);
        } else {
            println!("=> CallGlow, method: {:?}", method);
        }
        Ok("glow".to_string())
    }
    pub fn is_initialized(&mut self) -> bool {
        return self.initialized
    }
}




