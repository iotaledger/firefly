const { ipcRenderer, contextBridge } = require('electron')
const ElectronApi = require('./electronApi')
const WalletApi = require('firefly-actor-system-nodejs-bindings')

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
    const WalletApi = require('firefly-actor-system-nodejs-bindings')

    if (process.env.NODE_ENV == 'development') {
        WalletApi.initLogger({
            color_enabled: true,
            outputs: [
                {
                    name: 'wallet.log',
                    level_filter: 'debug',
                },
            ],
        })
    }

    try {
        WalletApi.migrateStrongholdSnapshotV2ToV3(
            '/home/maxwellmattryan/dev/iota/backups/old-01.stronghold',
            'raise-pencil-stone',
            '/home/maxwellmattryan/dev/iota/backups/MIGRATED.stronghold',
            'raise-pencil-stone'
        )
    } catch (err) {
        console.error(err)
    }

    contextBridge.exposeInMainWorld('__WALLET__', WalletApi)
    contextBridge.exposeInMainWorld('__ELECTRON__', ElectronApi)
} catch (error) {
    ipcRenderer.invoke('handle-error', '[Preload Context] Error', error)
}
