import extension from "../../shared/browser";
import Bridge from '../../shared/bridge'
import type { Msg, Tx, CallGlowPayload } from '../../shared/types'

const bridge = new Bridge().registerSender(extension.runtime.sendMessage)

let defaultMessageID = ''
let defaultOrigin = ''

export function init(msgID:string, origin:string) {
  defaultMessageID = msgID
  defaultOrigin = origin
  extension.runtime.onMessage.addListener(function (m) {
    bridge.onResponse(m)
  })
}

export async function send_transfer(accountID: string, tx:Tx) {
  return await bridge.sendMessage(<Msg>{
    id: defaultMessageID,
    from: defaultOrigin,
    cmd: 'SendTransfer',
    payload: {
      accountId: accountID,
      transfer: tx,
    }
  });
}

export async function cancel() {
  return await bridge.sendMessage(<Msg>{
    id: defaultMessageID,
    from: defaultOrigin,
    cmd: 'CallGlow',
    payload: <CallGlowPayload>{
      method: 'Cancel'
    }
  });
}

// no default message ID or from
export async function get_profle() {
  return await bridge.sendMessage(<Msg>{
    cmd: 'CallGlow',
    payload: <CallGlowPayload>{
      method: 'GetProfile'
    }
  });
}

export async function get_accounts() {
  return await bridge.sendMessage(<Msg>{
    id: defaultMessageID,
    from: defaultOrigin,
    cmd: 'GetAccounts',
    payload: null
  });
}

// export async function get_balance() {
//   return await bridge.sendMessage(<Msg>{
//     cmd: 'GetBalance',
//     payload: null
//   });
// }