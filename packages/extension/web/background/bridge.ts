import Bridge, {Responder} from "../shared/bridge";
import extension from "../shared/browser";
import type {FullResponse, FullMsg, Response} from "../shared/types";
import { checkUrlOK, currentTab } from "../shared/utils";
import {tabsByURL} from '../shared/platform'
import {getOrigins} from './store'
import { encrypt_and_send } from "./connection/handshake";

// user time to confirm
const TIMEOUT = 12000

const tabs = (extension as any).tabs;
const ID = extension.runtime.id
const ORIGIN = 'chrome-extension://'+ID

const responders: Responder[] = [
  {
    checker: o=> o===ORIGIN, // send extension messages right back
    to: function(m){
      extension.runtime.sendMessage(m)
    }
  },
  {
    checker: ()=> true, // otherwise find tab by origin
    to: function(m,o) {
      forwardToContentScriptByOrigin(o, m)
    }
  }
]

const bridge = new Bridge()
  .registerSender(encrypt_and_send)
  .registerResponders(responders)
  .setDefaultTimeout(TIMEOUT);

export async function respondToContentScript(msg:FullMsg, res:Response) {
  return await forwardToContentScript(<FullResponse>{
    id: msg.id,
    type: res.type,
    payload: res.payload,
    action: msg.cmd,
    origin: msg.origin,
  })
}
export async function forwardToContentScript(res: FullResponse) {
  const tab = await currentTab();
  if (!(tab && tab.id && tab.url)) return;
  if (!checkUrlOK(tab.url)) return;
  forwardToContentScriptWithTabId(tab.id, res);
}
export async function respondToContentScriptWithTabId(tabId, msg:FullMsg, res:Response) {
  return await forwardToContentScriptWithTabId(tabId, <FullResponse>{
    id: msg.id,
    type: res.type,
    payload: res.payload,
    action: msg.cmd,
    origin: msg.origin,
  })
}
export async function forwardToContentScriptWithTabId(tabId, res: FullResponse) {
  tabs.sendMessage(tabId, res);
}
export async function forwardToContentScriptByOrigin(origin, res: FullResponse) {
  const origins = await getOrigins()
  const originsToSendTo = origins ? origins.filter(o=> o.origin===origin) : []
  const ts = await tabsByURL(originsToSendTo.map(o=>o.origin+'/*'))
  ts && ts.forEach(t=> {
    forwardToContentScriptWithTabId(t.id, res)
  })
}

export {bridge}
