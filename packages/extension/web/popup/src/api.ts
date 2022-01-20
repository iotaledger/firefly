import type {Msg,Origin,Response,AccountMethod,CallGlowPayload} from '../../shared/types'
import extension from '../../shared/browser'
import Bridge from '../../shared/bridge'
import {origins} from './store'

const bridge = new Bridge().registerSender(extension.runtime.sendMessage)
extension.runtime.onMessage.addListener(bridge.onResponse)

export async function check_link() {
  return await bridge.sendMessage(<Msg>{
    cmd:'CallGlow',
    payload:<CallGlowPayload>{
      method:'CheckLink'
    }
  });
}

export async function link_profile() {
  return await bridge.sendMessage(<Msg>{
    cmd:'CallGlow',
    payload:<CallGlowPayload>{
      method:'LinkProfile',
      payload:''
    }
  });
}

export async function add_origin(o: Origin) {
  const r:any = await bridge.sendMessage(<Msg>{
    cmd:'CallGlow',
    payload:<CallGlowPayload>{
      method:'AddOrigin',
      payload:JSON.stringify(o),
    }
  });
  if(!(r && r.payload)) return null
  origins.update(ds=> [o, ...ds])
  return r
}

export async function update_origin(o: Origin) {
  const r:any = await bridge.sendMessage(<Msg>{
    cmd:'CallGlow',
    payload:<CallGlowPayload>{
      method:'UpdateOrigin',
      payload:JSON.stringify(o),
    }
  });
  if(!(r && r.payload)) return null
  // origins.update(ds=> [o, ...ds])
  return r
}

export async function remove_origin(origin:string) {
  const r:any = await bridge.sendMessage(<Msg>{
    cmd:'CallGlow',
    payload:<CallGlowPayload>{
      method:'RemoveOrigin',
      payload: origin
    }
  });
  if(!(r && r.payload && r.payload.origin)) return null
  origins.update(ds=> ds.filter(d=>d.origin!==r.payload.origin))
  return r
}

export async function get_origins() {
  return await bridge.sendMessage(<Msg>{
    cmd:'CallGlow',
    payload:<CallGlowPayload>{
      method:'GetOrigins'
    }
  });
}

export async function get_accounts() {
  return await bridge.sendMessage(<Msg>{
    cmd:'GetAccounts'
  });
}

export async function send_transfer() {
  return await bridge.sendMessage(<Msg>{
    cmd:'SendTransfer'
  });
}

const ACCOUNT_ID = '12345' // HARDCODED

async function call_account_method(method: AccountMethod) {
  return await bridge.sendMessage({
    cmd: 'CallAccountMethod',
    payload: {
      accountId: ACCOUNT_ID,
      method
    }
  })
}

export async function get_balance() {
  return await call_account_method({
    name: 'GetBalance'
  })
}

export async function generate_address() {
  return await call_account_method({
    name: 'GenerateAddress'
  })
}

export async function get_latest_address() {
  return await call_account_method({
    name: 'GetLatestAddress'
  })
}

export async function list_messages() {
  return await call_account_method({
    name: 'ListMessages'
  })
}

export async function list_addresses() {
  return await call_account_method({
    name: 'ListAddresses'
  })
}

export async function sync_account() {
  return await call_account_method({
    name: 'SyncAccount'
  })
}