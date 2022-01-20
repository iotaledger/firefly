import type { Msg,Origin,FullResponse } from '../../shared/types'
import extension from "../../shared/browser";
import {checkUrlOK} from '../../shared/utils'
import storage from './storage'

const key = 'origins'

// storage.clear()

export async function acceptList(origin:string) {
  const origins = await getOrigins()
  const found = origins.find(d=>d.origin===origin)
  return found ? true : false
}

export async function getOrigins(): Promise<Origin[]> {
  const r = await storage.get()
  return (r[key] && Array.isArray(r[key])) ? [...r[key]] : []
}

export async function addOrigin(incoming: Origin) {
  const origins = await getOrigins()
  if(origins.find(o=>o.origin===incoming.origin)) return
  await storage.set({
    [key]: [...origins, incoming]
  })
}

export async function removeOrigins(origin: string) {
  const origins = await getOrigins()
  await storage.set({
    [key]: origins.filter(d=>d.origin!==origin)
  })
}

export async function updateOrigin(incoming: Origin) {
  const origins = await getOrigins()
  const idx = origins.findIndex(o=>o.origin===incoming.origin)
  if(idx>-1) {
    origins[idx].acl = incoming.acl
  }
  await storage.set({
    [key]: [...origins]
  })
}

export async function clearAllOrigins() {
  await storage.set({
    [key]: []
  })
}

const tabs = (extension as any).tabs
tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') { // page loaded
    if (checkUrlOK(tab.url)) {
      const origin = new URL(tab.url).origin
      const origins = await getOrigins()
      if(origins.find(d=>d.origin===origin)) {
        tabs.executeScript(tabId, { file: 'build/content.js' }, function(){
          setTimeout(()=> sendInitMsg(tabId, origin), 1000)
        });
      }
    }
  }
})

function sendInitMsg(tabId: number, origin:string) {
  tabs.sendMessage(tabId,<FullResponse>{
    id: '_',
    type:'AddedOrigin',
    payload:<Origin>{origin},
    action: 'CallGlow',
    origin: 'chrome-extension://'+extension.runtime.id,
  })
}
