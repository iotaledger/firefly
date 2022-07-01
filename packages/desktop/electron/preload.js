const { ipcRenderer, contextBridge } = require('electron')
const ElectronApi = require('./electronApi')

const SEND_CRASH_REPORTS = window.process.argv.includes('--send-crash-reports=true')
let captureException = (..._) => {}
let manager

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
    const WalletApi = require('@iota/wallet')

    const { STAGE, NODE_ENV } = process.env
    if (NODE_ENV === 'development' || STAGE === 'alpha' || STAGE === 'beta') {
        const loggerOptions = {
            colorEnabled: true,
            name: './wallet.log',
            levelFilter: 'debug',
        }
        WalletApi.initLogger(loggerOptions)
    }

    // contextBridge doesn't allow passing custom properties & methods on prototype chain
    // https://www.electronjs.org/docs/latest/api/context-bridge
    // This workaround exposes the classes through factory methods
    // The factory method also copies all the prototype methods to the object so that it gets passed through the bridge
    contextBridge.exposeInMainWorld('__WALLET__API__', {
        createAccountManager(options) {
            const protoProps = Object.getOwnPropertyNames(WalletApi.AccountManager.prototype)
            manager = new WalletApi.AccountManager(options)

            protoProps.forEach((key) => {
                if (key !== 'constructor') {
                    manager[key] = manager[key].bind(manager)
                }
            })

            return manager
        },
        async getAccount(index) {
            const account = await manager.getAccount(index)
            const protoProps = Object.getOwnPropertyNames(WalletApi.Account.prototype)

            protoProps.forEach((key) => {
                if (key !== 'constructor') {
                    account[key] = account[key].bind(account)
                }
            })

            return account
        },
    })
    contextBridge.exposeInMainWorld('__ELECTRON__', ElectronApi)
} catch (error) {
    ipcRenderer.invoke('handle-error', '[Preload Context] Error', error)
}
