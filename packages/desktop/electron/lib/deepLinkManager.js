import { ipcRenderer } from 'electron'

/** Deep link manager  */
// Runs in renderer process
export default {
    checkDeepLinkRequestExists: () => {
        ipcRenderer.send('check-deep-link-request-exists')
    },
    clearDeepLinkRequest: () => {
        ipcRenderer.send('clear-deep-link-request')
    },
}
