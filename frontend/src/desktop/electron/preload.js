const binding = require('wallet-actor-system-nodejs-binding')

binding.init()

window.__WALLET__ = binding

// TODO this is only for the test; should be removed later
const fs = require('fs')
window.__deleteStrongholdSnapshot = () => {
    fs.rmdirSync('./example-database', { recursive: true })
}
