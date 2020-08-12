import {
  Plugins
} from "@capacitor/core"
const {
  WalletPlugin
} = Plugins

let __initialized = false

function sendMessage(message) {
  return WalletPlugin.sendMessage({
    message
  })
}

function __initialize() {
  WalletPlugin.initialize({
    storagePath: 'data/data/com.iota.wallet/cache/database'
  })
}

function createAccount() {
  if (!__initialized) {
    __initialize()
    __initialized = true
  }

  return sendMessage({
    cmd: 'CreateAccount',
    payload: {
      id: 'account_id',
      clientOptions: {
        node: 'https://nodes.devnet.iota.org:443'
      }
    }
  })
}

export {
  createAccount
}