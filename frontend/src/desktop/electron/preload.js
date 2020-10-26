const { init, sendMessage } = require('wallet-actor-system-nodejs-binding')

init()

window.__WALLET__ = {
  sendMessage(message) {
    return sendMessage(JSON.stringify(message))
  }
}
