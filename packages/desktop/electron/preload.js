const binding = require('wallet-nodejs-binding')
const PincodeManager = require('../libs/pincodeManager');
const DeepLinkManager = require('../libs/deepLinkManager');
const NotificationManager = require('../libs/notificationManager');
const { ipcRenderer, contextBridge } = require('electron')

const __WALLET__ = binding;

const Electron = {
    PincodeManager,
    DeepLinkManager,
    NotificationManager,
    getStrongholdBackupDestination: () => {
        return ipcRenderer.invoke('show-open-dialog', { properties: ['openDirectory'] }).then((result) => {
            if (result.canceled) {
                return null
            }

            return result.filePaths[0]
        })
    },
    /**
     * Gets directory for app's configuration files
     *
     * @method getUserDataPath
     *
     * @returns {Promise}
     */
    getUserDataPath: () => ipcRenderer.invoke('get-path', 'userData'),
    /**
     * Starts an update of the application
     *
     * @method updateDownload
     *
     * @returns void
     */
    updateDownload: () => ipcRenderer.invoke('update-download'),
    /**
     * Cancels an update of the application
     *
     * @method updateCancel
     *
     * @returns void
     */
    updateCancel: () => ipcRenderer.invoke('update-cancel'),
    /**
     * Install an update of the application
     *
     * @method updateInstall
     *
     * @returns void
     */
    updateInstall: () => ipcRenderer.invoke('update-install'),
    /**
     * Get version details
     *
     * @method getVersionDetails
     *
     * @returns void
     */
    getVersionDetails: () => ipcRenderer.invoke('update-get-version-details'),
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
