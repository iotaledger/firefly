const { ipcRenderer, contextBridge } = require('electron')
const ElectronApi = require('./electronApi')
const WalletApi = require('@iota/wallet')

const SEND_CRASH_REPORTS = window.process.argv.includes('--send-crash-reports=true')
let captureException = (..._) => {}

if (SEND_CRASH_REPORTS) {
    captureException = require('../sentry')(true).captureException
}

const profileManagers = {}

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
    const { STAGE, NODE_ENV } = process.env
    if (NODE_ENV === 'development' || STAGE === 'alpha' || STAGE === 'beta') {
        const loggerOptions = {
            colorEnabled: true,
            name: './wallet.log',
            levelFilter: 'debug',
            targetExclusions: ['h2', 'hyper', 'rustls', 'message_handler'],
        }
        WalletApi.initLogger(loggerOptions)
    }
} catch (error) {
    ipcRenderer.invoke('handle-error', '[Preload Context] Logger already initialized', error)
}

try {
    // contextBridge doesn't allow passing custom properties & methods on prototype chain
    // https://www.electronjs.org/docs/latest/api/context-bridge
    // This workaround exposes the classes through factory methods
    // The factory method also copies all the prototype methods to the object so that it gets passed through the bridge
    contextBridge.exposeInMainWorld('__WALLET__API__', {
        createAccountManager(id, options) {
            const protoProps = Object.getOwnPropertyNames(WalletApi.AccountManager.prototype)
            const manager = new WalletApi.AccountManager(options)
            manager.id = id
            profileManagers[id] = manager

            protoProps.forEach((key) => {
                if (key !== 'constructor') {
                    manager[key] = manager[key].bind(manager)
                }
            })

            return manager
        },
        deleteAccountManager(id) {
            if (id && id in profileManagers) {
                delete profileManagers[id]
            }
        },
        async getAccount(id, index) {
            const manager = profileManagers[id]
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
