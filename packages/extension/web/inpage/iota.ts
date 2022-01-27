import type { FullMsg, AccountMethod, Tx, FullResponse } from '../shared/types'
import Bridge from '../shared/bridge'
export * from './events'
import * as eventHandlers from './events/handlers'

function sendMessage(msg: FullMsg) {
  if(typeof msg!=='object') return
  return window.postMessage(
    {...msg, _injected:true}, 
    window.location.origin
  )
}

const bridge = new Bridge()
  .registerSender(sendMessage)
  .setDefaultTimeout(12000)

function gotMessage(m) {
  console.log('=> gotMessage', m)
  if(typeof m.data!=='object') return
  if(m.data._injected) return 
  bridge.onResponse(m.data)
  const responseType = m.data && m.data.type
  if(eventHandlers[responseType]) {
    eventHandlers[responseType](m.data)
  }
}
window.addEventListener("message", gotMessage, false);

async function callAccountMethod(method: AccountMethod) {
  return await bridge.sendMessage({
    cmd: 'CallAccountMethod',
    payload: {
      accountId: '12345',
      method
    }
  })
}

export async function getBalance() {
  return await callAccountMethod({
    name: 'GetBalance'
  })
}

export async function sendTransfer(tx: Tx) {
  return await bridge.sendMessage({
    cmd: 'SendTransfer',
    payload: {
      transfer: tx
    }
  })
}

export async function getAccounts() {
  return await bridge.sendMessage({
    cmd: 'GetAccounts',
    payload: null
  })
}



