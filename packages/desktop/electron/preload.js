const { ipcRenderer, contextBridge } = require('electron')
const ElectronApi = require('./electronApi')

// Hook the error handlers as early as possible
window.addEventListener('error', (event) => {
    if (event.error && event.error.message) {
        ipcRenderer.invoke('handle-error', 'Preload Context Error', {
            message: event.error.message,
            stack: event.error.stack,
        })
    } else {
        ipcRenderer.invoke('handle-error', 'Preload Context Error', event.error || event)
    }
    event.preventDefault()
    console.error(event.error || event)
})

window.addEventListener('unhandledrejection', (event) => {
    ipcRenderer.invoke('handle-error', 'Preload Render Context Unhandled Rejection', event.reason)
    event.preventDefault()
    console.error(event.reason)
})

try {
    const binding = require('wallet-nodejs-binding')
    const { proxyApi } = require('shared/lib/shell/walletApi')

    const Wallet = binding

    Wallet.initLogger({
        color_enabled: true,
        outputs: [
            {
                name: 'wallet.log',
                level_filter: 'debug',
            },
        ],
    })

    Wallet.api = proxyApi(ElectronApi.getActiveProfile)

    contextBridge.exposeInMainWorld('__WALLET_INIT__', {
        run: Wallet.init,
    })

    contextBridge.exposeInMainWorld('__WALLET_API__', Wallet.api)

    contextBridge.exposeInMainWorld('Electron', ElectronApi)
} catch (error) {
    ipcRenderer.invoke('handle-error', 'Preload Error', error)
}
