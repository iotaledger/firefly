const { ipcRenderer, contextBridge } = require('electron')
const ElectronApi = require('./electronApi')
const WalletApi = require('@iota/wallet')
const fs = require('fs')

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
    if (process.env.NODE_ENV === 'development') {
        const logDir = './log'
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir)
        }

        const today = new Date().toISOString().slice(0, 16).replace('T', '-').replace(':', '-')
        const loggerOptions = {
            colorEnabled: true,
            name: `./log/wallet-${today}.log`,
            levelFilter: 'debug',
            targetExclusions: ['h2', 'hyper', 'rustls', 'message_handler'],
        }
        WalletApi.initLogger(loggerOptions)
    }
} catch (error) {
    console.error('[Preload Context] Error:', error)
}

try {
    // contextBridge doesn't allow passing custom properties & methods on prototype chain
    // https://www.electronjs.org/docs/latest/api/context-bridge
    // This workaround exposes the classes through factory methods
    // The factory method also copies all the prototype methods to the object so that it gets passed through the bridge
    contextBridge.exposeInMainWorld('__WALLET__API__', {
        createAccountManager(id, options) {
            const manager = new WalletApi.AccountManager(options)
            manager.id = id
            profileManagers[id] = manager
            bindMethodsAcrossContextBridge(WalletApi.AccountManager.prototype, manager)
            return manager
        },
        async createAccount(managerId, payload) {
            const manager = profileManagers[managerId]
            const account = await manager.createAccount(payload)
            bindMethodsAcrossContextBridge(WalletApi.Account.prototype, account)
            return account
        },
        deleteAccountManager(id) {
            if (id && id in profileManagers) {
                delete profileManagers[id]
            }
        },
        async getAccount(managerId, index) {
            const manager = profileManagers[managerId]
            const account = await manager.getAccount(index)
            bindMethodsAcrossContextBridge(WalletApi.Account.prototype, account)
            return account
        },
        async getAccounts(managerId) {
            const manager = profileManagers[managerId]
            const accounts = await manager.getAccounts()
            accounts.forEach((account) => bindMethodsAcrossContextBridge(WalletApi.Account.prototype, account))
            return accounts
        },
        async recoverAccounts(managerId, payload) {
            const manager = profileManagers[managerId]
            const accounts = await manager.recoverAccounts(...Object.values(payload))
            accounts.forEach((account) => bindMethodsAcrossContextBridge(WalletApi.Account.prototype, account))
            return accounts
        },
    })
    contextBridge.exposeInMainWorld('__ELECTRON__', ElectronApi)
} catch (error) {
    ipcRenderer.invoke('handle-error', '[Preload Context] Error', error)
}

function bindMethodsAcrossContextBridge(prototype, object) {
    const prototypeProperties = Object.getOwnPropertyNames(prototype)
    prototypeProperties.forEach((key) => {
        if (key !== 'constructor') {
            object[key] = object[key].bind(object)
        }
    })
}
