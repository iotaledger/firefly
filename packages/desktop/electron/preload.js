const binding = require('wallet-nodejs-binding')
const PincodeManager = require('../libs/pincodeManager');
const DeepLinkManager = require('../libs/DeepLinkManager');
const { remote, ipcRenderer, contextBridge } = require('electron')

const __WALLET__ = binding;

const Electron = {
    PincodeManager,
    DeepLinkManager,
    getStrongholdBackupDestination: () => {
        return remote.dialog.showOpenDialog({ properties: ['openDirectory'] }).then((result) => {
            if (result.canceled) {
                return null
            }

            return result.filePaths[0]
        })
    },
    /**
     * Add native window wallet event listener
     * @param {string} event - Target event name
     * @param {function} callback - Event trigger callback
     * @returns {undefined}
     */
    onEvent: function (event, callback) {
        let listeners = this._eventListeners[event];
        if (!listeners) {
            listeners = this._eventListeners[event] = [];
            ipcRenderer.on(event, (e, args) => {
                listeners.forEach((call) => {
                    call(args);
                });
            });
        }
        listeners.push(callback);
    },
    _eventListeners: {},
};

contextBridge.exposeInMainWorld('__WALLET__', __WALLET__);
contextBridge.exposeInMainWorld('Electron', Electron);
