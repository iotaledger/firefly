const binding = require('wallet-nodejs-binding')
const PincodeManager = require('../libs/pincodeManager');

const freezeObjectFactory = (obj) => {
    const rejector = {
        get(obj, prop) {
            if (typeof obj[prop] === 'object' && obj[prop] !== null) {
                return new Proxy(obj[prop], rejector)
            }

            return obj[prop]
        },
        set() {
            return false
        },
    }

    return new Proxy(obj, rejector)
}

window.__WALLET__ = freezeObjectFactory(binding)

window.Electron = {
    PincodeManager
};
