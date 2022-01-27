import type {
  Msg,
  FullMsg,
  Response,
  Origin,
  GlowMethodName,
  CallGlowPayload,
  SimpleProfile
} from "../shared/types";
import type {Account} from "../shared/typesFirefly";
import { tryHandshake, is_initialized } from "./connection/handshake";
import { isConnected } from "./connection/ws";
import extension from "../shared/browser";
import { checkUrlOK, currentTab } from "../shared/utils";
import * as notify from "../shared/platform/notify";
import * as store from "./store";
import {
  bridge,
  respondToContentScriptWithTabId,
  respondToContentScript,
} from "./bridge";

const tabs = (extension as any).tabs;

function receiveWalletMessage(m) {
  bridge.onResponse(m);
  // if(m.action==='GetAccounts') {
  //   const first = m.payload[0]
  //   store.setProfile(first.id)
  // }
  // extension.runtime.sendMessage(m);
  // forwardToContentScript(m);
}

export async function CallGlow(msg: FullMsg) {
  const method: GlowMethodName = msg.payload && msg.payload.method;
  switch (method) {
    case "LinkProfile":
      return LinkProfile(msg);
    case "CheckLink":
      return CheckLink(msg);
    case "AddOrigin":
      return AddOrigin(msg);
    case "RemoveOrigin":
      return RemoveOrigin(msg);
    case "UpdateOrigin":
      return UpdateOrigin(msg);
    case "GetOrigins":
      return GetOrigins(msg);
    case "GetAuthorizedAccounts":
      return GetAuthorizedAccounts(msg);
    case "GetProfile":
      return GetProfile(msg);
    case "Cancel":
      return Cancel(msg);
    default:
      return;
  }
}

export async function LinkProfile(msg: FullMsg) {
  try {
    function receiveInitialMessage(str: string) {
      const data = JSON.parse(str);
      if (!store.validateProfile(data)) {
        return;
      }
      const emojis = data.emojis;
      store.setEmojis(emojis);
      store.setProfile(<SimpleProfile>{
        accounts: data.accounts,
        name: data.name,
        id: data.id
      });
      const res = <Response>{
        type: "LinkedProfile",
        payload: <CallGlowPayload>{
          method: "LinkProfile",
          payload: emojis,
        },
      };
      bridge.respond(msg, res);
    }
    await tryHandshake(receiveWalletMessage, receiveInitialMessage);
    bridge.sendMessage(msg);
  } catch (e) {
    console.log("LINK WALLET error:", e);
    bridge.respond(msg, {
      type: "Error",
      payload: "Could not link wallet",
    });
  }
}

export async function CheckLink(msg: FullMsg) {
  // console.log("isConnected()", isConnected())
  // console.log("is_initialized()", is_initialized())
  if (isConnected() && is_initialized()) {
    bridge.sendMessage(msg);
  } else {
    bridge.respond(msg, {
      type: "Error",
      payload: "Wallet not linked",
    });
  }
}

export async function AddOrigin(msg: FullMsg) {
  try {
    const og: Origin = JSON.parse(msg.payload.payload);
    const tab = await currentTab();
    if (!(tab && tab.id && tab.url)) return;
    if (!checkUrlOK(tab.url)) return;
    const origin = new URL(tab.url).origin;
    if (origin !== og.origin) {
      return bridge.respond(msg, <Response>{
        type: "Error",
        payload: "Origin does not match",
      });
    }
    tabs.executeScript(tab.id, { file: "build/content.js" }, function () {
      // tabs.sendMessage(tab.id, {oy:'tabs.sendMessage'});
      const newOrigin = <Origin>{ origin, fav:og.fav, acl:og.acl }
      const body = <Response>{
        type: "AddedOrigin",
        payload: newOrigin,
      };
      bridge.respond(msg, body);
      store.addOrigin(newOrigin);
      setTimeout(() => {
        respondToContentScriptWithTabId(tab.id, msg, body);
      }, 1000);
    });
  } catch (e) {
    console.log("=> AddOrigin ERROR", e);
  }
}

export async function RemoveOrigin(msg: FullMsg) {
  await store.removeOrigins(msg.payload.payload);
  const body = <Response>{
    type: "RemovedOrigin",
    payload: <Origin>{ origin: msg.payload.payload },
  };
  bridge.respond(msg, body);
  respondToContentScript(msg, body)
}

export async function UpdateOrigin(msg: FullMsg) {
  try {
    const og: Origin = JSON.parse(msg.payload.payload);
    await store.updateOrigin(og);
    const body = <Response>{
      type: "UpdatedOrigin",
      payload: og,
    };
    bridge.respond(msg, body);
    respondToContentScript(msg, body)
  } catch(e) {
    console.log('=> UpdateOrigin ERROR', e)
  }
}

export async function GetOrigins(msg: FullMsg) {
  const origins = await store.getOrigins();
  bridge.respond(msg, {
    type: "GotOrigins",
    payload: origins,
  });
}

export async function Cancel(msg: FullMsg) {
  notify.closeNotify();
  bridge.respond(msg, {
    type: "Cancelled",
    payload: null,
  });
}

export async function GetProfile(msg: FullMsg) {
  const profile = await store.getProfile();
  bridge.respond(msg, {
    type: "GotProfile",
    payload: profile,
  });
}

export async function GetAuthorizedAccounts(msg: FullMsg) {
  const profile = await store.getProfile();
  const accs = profile.accounts
  const accounts: Account[] = []
  for (let i=0; i<accs.length; i++) {
    const acc = await bridge.sendMessage(<Msg>{
      cmd:'GetAccount',
      payload: accs[i].id
    })
    accounts.push(acc)
  }
  const body = <Response>{
    type: "GotAuthorizedAccounts",
    payload: accounts,
  };
  bridge.respond(msg, body)
}

/*****************************
ACTUAL WALLET.rs MESSAGE TYPES
*****************************/

export async function CallAccountMethod(msg: FullMsg) {
  console.log("ACTION: CallAccountMethod", msg);
  const profile = await store.getProfile();
  msg.payload.accountId = profile.accounts[0].id;
  bridge.sendMessage(msg);
  notify.closeNotify();
  // if (!msg.payload.method) return;
  // const payload: AccountMethodPayload = msg.payload;
  // if (payload.method.name === "GetBalance") {
  //   const body = <Response>{
  //     type: "Balance",
  //     payload: <AccountBalance>{
  //       total: 123456,
  //     }, // HARDCODED
  //   };
  //   respond(body);
  // }
}

export async function GetAccounts(msg: FullMsg) {
  bridge.sendMessage(msg);
  notify.closeNotify();
}

export async function GetBalance(msg: FullMsg) {
  bridge.sendMessage(msg);
  notify.closeNotify();
}

export async function SendTransfer(msg: FullMsg) {
  console.log("SEND TRANSFER CALLED", msg);
  // const m: FullMsg = {
  //   actorId: "", // empty
  //   cmd: "SendTransfer",
  //   id: msg.id,
  //   origin: msg.origin,
  //   payload: msg.payload,
  // };
  if (!msg.payload.transfer) return console.log("SendTransfer - invalid payload (no transfer)");
  if (!msg.payload.accountId) return console.log("SendTransfer - invalid payload (no accountId)");
  if (!msg.payload.transfer.remainder_value_strategy) {
    msg.payload.transfer.remainder_value_strategy = {
      strategy: "ChangeAddress",
    };
  }
  if (!msg.payload.transfer.indexation) {
    msg.payload.transfer.indexation = { index: "firefly", data: new Array() };
  }
  bridge.sendMessage(msg);
  notify.closeNotify();
}
