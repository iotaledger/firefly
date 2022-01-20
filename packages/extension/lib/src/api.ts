import type {Tx,Mint,Melt,Arg,Func} from './types'

declare global {
  interface Window { iota: any; }
}

export async function send(tx: Tx) {
  return run('sendTransfer', tx)
}

export async function mint(a: Mint) {
  return run('mint', a)
}

export async function melt(a: Melt) {
  return run('melt', a)
}

export async function getAccounts() {
  return run('getAccounts')
}

async function run(f:Func, a?:Arg) {
  if(window.iota && window.iota[f]) {
    return window.iota[f](a)
  }
}

interface EventCallbacks {
  connected?: Function
  disconnected?: Function
}
export function subscribeEvents(ec:EventCallbacks, poll?:boolean){
  if(!(window.iota && window.iota.events)) {
    if(poll) setTimeout(()=> subscribeEvents(ec, true), 500)
    return
  }
  const ET = window.iota.EventTypes
  window.iota.events.on(ET.ADDED_ORIGIN, e=>{
    if(ec.connected) ec.connected(e)
  })
  window.iota.events.on(ET.REMOVED_ORIGIN, e=>{
    if(ec.disconnected) ec.disconnected(e)
  })
}

