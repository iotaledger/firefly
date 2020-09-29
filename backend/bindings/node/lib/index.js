var addon = require('../native');

module.exports = {
  init(storagePath = '') {
    addon.init(storagePath)
  },
  sendMessage(message) {
    return new Promise((resolve, reject) => {
      addon.sendMessage(message, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(JSON.parse(res))
        }
      })
    })
  }
}