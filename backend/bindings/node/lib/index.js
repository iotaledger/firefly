var addon = require('../native');

module.exports = {
  init() {
    addon.initialize()
  },
  sendMessage(message) {
    return new Promise((resolve, reject) => {
      addon.sendMessage(message, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }
}