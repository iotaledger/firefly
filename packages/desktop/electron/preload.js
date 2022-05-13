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
    const WalletApi = require('firefly-actor-system-nodejs-bindings')
    const WalletStardustApi = require('@iota/wallet')

    if (process.env.NODE_ENV == 'development') {
        const loggerOptions = (name = 'wallet.log') => ({
            color_enabled: true,
            outputs: [
                {
                    name,
                    level_filter: 'debug',
                },
            ],
        })

        WalletApi.initLogger(loggerOptions())
        WalletStardustApi.initLogger(loggerOptions('wallet-stardust.log'))
    }

    contextBridge.exposeInMainWorld('__WALLET__', WalletApi)

    // contextBridge doesn't allow passing custom properties & methods on prototype chain
    // https://www.electronjs.org/docs/latest/api/context-bridge
    // This workaround exposes the classes through factory methods
    // The factory method also copies all the prototype methods to the object so that it gets passed through the bridge
    contextBridge.exposeInMainWorld('__WALLET__STARDUST__', {
        createAccountManager(options) {
            const protoProps = Object.getOwnPropertyNames(WalletStardustApi.AccountManager.prototype)
            manager = new WalletStardustApi.AccountManager(options)

            protoProps.forEach((key) => {
                if (key !== 'constructor') {
                    manager[key] = manager[key].bind(manager)
                }
            })

            return manager
        },
        async getAccount(index) {
            const account = await manager.getAccount(index)
            const protoProps = Object.getOwnPropertyNames(WalletStardustApi.Account.prototype)

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
