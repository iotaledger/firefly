const { ipcRenderer } = require('electron')

/** Deep link manager  */
// Runs in renderer process
const ElectronDeepLinkManager = {
    checkDeepLinkRequestExists: () => {
        ipcRenderer.send('check-deep-link-request-exists')
    },
    clearDeepLinkRequest: () => {
        ipcRenderer.send('clear-deep-link-request')
    },
}

module.exports = ElectronDeepLinkManager
