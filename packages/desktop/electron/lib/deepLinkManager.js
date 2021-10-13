const { ipcRenderer } = require('electron')

/** Deep link manager  */
// Runs in renderer process
const DeepLinkManager = {
    requestDeepLink: () => {
        ipcRenderer.send('deep-link-request')
    },
}

module.exports = DeepLinkManager
