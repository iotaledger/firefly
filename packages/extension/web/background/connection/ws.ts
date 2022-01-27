const WS_URL = 'ws://127.0.0.1:51739'

let ws: WebSocket;

export function isConnected(){
  return ws && ws.readyState===1 // OPEN
}

export function start_client(on_msg:Function, on_disconnect?:Function) {
  return new Promise((resolve,reject)=>{ 
    ws = new WebSocket(WS_URL)
    ws.onopen = function (e) {
      console.log("OPEN", e)
      resolve(true)
    }
    ws.onmessage = function (e) {
      // console.log("MESSAGE", e.data)
      if(on_msg) on_msg(e.data)
    }
    ws.onclose = function (e) {
      // console.log("CLOSED", e)
      on_disconnect()
      reject(e)
    }
    ws.onerror = function() {
      on_disconnect()
    }
  })
}

export function send(msg:string){
  if(!msg || !ws) return
  ws.send(msg)
}

