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

function createAccount() {
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