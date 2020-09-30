import {
  Plugins
} from "@capacitor/core"
const {
  WalletPlugin
} = Plugins

function sendMessage(message) {
  return WalletPlugin.sendMessage({
    message
  })
}

function init() {
  WalletPlugin.initialize({
    storagePath: 'data/data/com.iota.wallet/cache/database'
  })
}

function createAccount() {
  return sendMessage({
    cmd: 'CreateAccount',
    payload: {
      clientOptions: {
        node: 'https://nodes.devnet.iota.org:443'
      }
    }
  })
}

export {
  init,
  createAccount
}