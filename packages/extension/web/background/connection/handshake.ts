
import * as wasm from './wasm';
import type {Msg} from '../../shared/types'
import * as ws from './ws';

let initialized = false

export function is_initialized():boolean {
  return initialized
}

export async function tryHandshake(receiveWalletMessage, receiveInitialMessage) {
  let done = false;
  let i = 0;
  while (!done) {
    if(i>=100) {
      done = true
      throw 'did not connect'
    }
    await sleep(250)
    try {
      await noise_handshake(receiveWalletMessage, receiveInitialMessage);
      done = true
      // console.log('yes!')
    } catch(e) {
      // console.log('no')
      i ++
    }
  }
}

export function noise_handshake(callback: Function, initializeCallback: Function) {
  return new Promise(async(resolve,reject)=>{

    // reload the wasm. Add a "re-init" function instead?
    await wasm.load_wasm()

    let abort = setTimeout(reject, 5000)

    function on_disconnect(){
      initialized = false
    }
    function received_message(m:string){
      if(m.startsWith('01')) { // b msg
        wasm.receive_b_message(m)
        const c_msg = wasm.c_message()
        ws.send(c_msg)
      }
      if(m.startsWith('03')) { // regular message
        if(initialized) {
          const dec = receive_and_decrypt(m)
          callback(dec)
          return
        } else {
          // INITIALIZED!
          initialized = true
          const dec = wasm.receive_message(m)
          initializeCallback(dec)
          clearTimeout(abort)
          resolve(true)
          return
        }
      }
    }

    try {
      await ws.start_client(received_message,on_disconnect)
      const a_msg = wasm.a_message()
      ws.send(a_msg)
    } catch(e) {
      // console.log("could not open websocket")
      reject()
    }
  })
}

export function encrypt_and_send(m: Msg) {
  const msg = wasm.make_message(JSON.stringify(m))
  ws.send(msg)
}

function receive_and_decrypt(s: string) {
  const m = wasm.receive_message(s)
  // console.log("LENGTH OF MSG", m.length)
  try {
    const dec = JSON.parse(m)
    return dec
  } catch (e) { 
    console.log('cant decode json',m,e)
  }
  return null
}

export async function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}