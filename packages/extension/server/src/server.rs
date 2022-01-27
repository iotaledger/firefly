use std::net::SocketAddr;
use tokio::{
  net::{TcpListener, TcpStream},
  sync::{
    Mutex,
    mpsc::{UnboundedSender,unbounded_channel},
    broadcast::{Receiver}
  }
};
use futures_util::{SinkExt, StreamExt};
use tokio_tungstenite::{
  tungstenite::{Message, Result as TungsteniteResult},
  accept_async, tungstenite::Error
};
use std::sync::Arc;

use crate::{noise::Noise, message::Result};
use crate::message::{CallbackMessage};

pub async fn start(s: UnboundedSender<CallbackMessage>, quit: Arc<Mutex<Receiver<()>>>, event_receiver: Arc<Mutex<Receiver<String>>>, profile:String) -> Result<()> {
  let addr = "127.0.0.1:51739";
  let listener = TcpListener::bind(&addr).await?;
  println!("Listening on : {}", addr);

  if let Ok((stream, _)) = listener.accept().await {
    let peer = stream.peer_addr().expect("connected streams should have a peer address");
    println!("Peer address: {}", peer);

    // one connection at a time
    let noise = Noise::new(); 
    accept_connection(peer, stream, noise, s.clone(), quit.clone(), event_receiver.clone(), profile).await;

    // for concurrent connections:
    // tokio::spawn(async move {
    //   let noise = Noise::new();
    //   accept_connection(peer, stream, noise, &cb).await;
    // });
  }
  Ok(())
}

pub async fn accept_connection(peer: SocketAddr, stream: TcpStream, noise:Noise, s: UnboundedSender<CallbackMessage>, quit: Arc<Mutex<Receiver<()>>>, event_receiver: Arc<Mutex<Receiver<String>>>, profile:String) {
  if let Err(e) = handle_connection(peer, stream, noise, s, quit, event_receiver, profile).await {
    match e {
      Error::ConnectionClosed | Error::Protocol(_) | Error::Utf8 => (),
      err => println!("Error processing connection: {}", err),
    }
  }
}

pub async fn handle_connection(_peer: SocketAddr, stream: TcpStream, mut noise: Noise, s: UnboundedSender<CallbackMessage>, quit: Arc<Mutex<Receiver<()>>>, event_receiver: Arc<Mutex<Receiver<String>>>, profile:String) -> TungsteniteResult<()> {
  let ws_stream = accept_async(stream).await.expect("Failed to accept");
  // info!("New WebSocket connection: {}", peer);
  let (mut ws_sender, mut ws_receiver) = ws_stream.split();

  let mut quit_receiver = quit.lock().await;
  let mut incoming_event = event_receiver.lock().await;
  // let mut msg_fut = ;
  loop {
    tokio::select! {
      _ = quit_receiver.recv() => {
        break; // kill the server
      },
      event = incoming_event.recv() => {
        if let Ok(e) = event {
          let enc = noise.make_message(e.as_str()); // encrypt
          let sent = ws_sender.send(Message::Text(enc)).await;
          match sent {
            Ok(_)=>(),
            Err(e)=>println!("error sending event ws {:?}", e)
          };
        }
      },
      incoming = ws_receiver.next() => { // does this work?
        match incoming {
          Some(m) => {
            if let Ok(msg) = m {
              if msg.is_text() {
                let thestr = msg.to_string();
                if let Ok((is_hello, received)) = noise.get_message(thestr.as_str(), Some(profile.as_str())) {
                  if is_hello {
                    let _ = ws_sender.send(Message::Text(received)).await; // ping back
                  } else {

                    let (response_tx, mut response_rx) = unbounded_channel();

                    let _ = s.send(CallbackMessage{
                      payload: Ok(received.clone()),
                      response_tx: response_tx,
                    });

                    let wallet_response = response_rx.recv().await;
                    // println!("GOT WALLET RES {:?}", wallet_response);

                    if let Some(hres) = wallet_response {
                      let enc = noise.make_message(hres.as_str()); // encrypt
                      let sent = ws_sender.send(Message::Text(enc)).await;
                      match sent {
                        Ok(_)=>(),
                        Err(e)=>println!("error sending ws {:?}", e)
                      }
                    }
                  }
                };
              } else if msg.is_close() {
                return Err(Error::ConnectionClosed)
              }
            }
            // msg_fut = ws_receiver.next(); // Receive next WebSocket message.
          }
          None => break,
        }
      }
    } // end select!
  }
  Ok(())
}
