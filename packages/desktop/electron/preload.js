const binding = require('wallet-nodejs-binding')
const PincodeManager = require('../libs/pincodeManager');
const { remote } = require('electron')

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
    PincodeManager,
    getStrongholdBackupDestination: () => {
        return remote.dialog.showOpenDialog({ properties: ['openDirectory'] }).then((result) => {
            if (result.canceled) {
                return null
            }

            return result.filePaths[0]
        })
    }

};
