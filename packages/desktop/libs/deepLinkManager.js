const { ipcRenderer } = require('electron')

/** Deep link manager  */
// Runs in renderer process
const DeepLinkManager = {
    requestDeepLink: () => {
        ipcRenderer.send('deepLink-request');
    }
}

module.exports = DeepLinkManager;
