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

    const Wallet = binding

    // TODO: Make dependent on environment variable
    Wallet.initLogger({
        color_enabled: true,
        outputs: [
            {
                name: 'wallet.log',
                level_filter: 'debug',
            },
        ],
    })

    contextBridge.exposeInMainWorld('__WALLET__', Wallet)

    contextBridge.exposeInMainWorld('Electron', ElectronApi)
} catch (error) {
    ipcRenderer.invoke('handle-error', 'Preload Error', error)
}
