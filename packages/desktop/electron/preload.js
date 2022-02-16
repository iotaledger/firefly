const { ipcRenderer, contextBridge } = require('electron')
const ElectronApi = require('./electronApi')

const SEND_CRASH_REPORTS = window.process.argv.includes('--send-crash-reports=true')
let captureException = (..._) => {}
if (SEND_CRASH_REPORTS) {
    captureException = require('../sentry')(true).captureException
}

// Hook the error handlers as early as possible
window.addEventListener('error', (event) => {
    if (event.error && event.error.message) {
        ipcRenderer.invoke('handle-error', '[Preload Context] Error', {
            message: event.error.message,
            stack: event.error.stack,
        })

        if (SEND_CRASH_REPORTS) {
            captureException(event.error)
        }
    } else {
        ipcRenderer.invoke('handle-error', '[Preload Context] Error', event.error || event)

        if (SEND_CRASH_REPORTS) {
            captureException(event)
        }
    }
    event.preventDefault()
    console.error(event.error || event)
})

window.addEventListener('unhandledrejection', (event) => {
    ipcRenderer.invoke('handle-error', '[Preload Context] Unhandled Rejection', event.reason)
    event.preventDefault()
    console.error(event.reason)
})

try {
    const binding = require('wallet-nodejs-binding')
    const Wallet = binding

    if (process.env.NODE_ENV == 'development') {
        Wallet.initLogger({
            color_enabled: true,
            outputs: [
                {
                    name: 'wallet.log',
                    level_filter: 'debug',
                },
            ],
        })
    }

    contextBridge.exposeInMainWorld('__WALLET__', Wallet)
    contextBridge.exposeInMainWorld('__ELECTRON__', ElectronApi)
} catch (error) {
    ipcRenderer.invoke('handle-error', '[Preload Context] Error', error)
}
