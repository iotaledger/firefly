/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */

const { ipcRenderer, contextBridge } = require('electron')
const ElectronApi = require('./electronApi')
const IotaSdk = require('@iota/sdk')
const fs = require('fs')

const SEND_CRASH_REPORTS = window.process.argv.includes('--send-crash-reports=true')
let captureException = (..._) => {}

if (SEND_CRASH_REPORTS) {
    captureException = require('../sentry')(true).captureException
}

const wallets = {}

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
    if (process.env.STAGE === 'prod') {
        // empty
    } else {
        ipcRenderer.invoke('get-path', 'userData').then(async (baseDir) => {
            const logDir = `${baseDir}/logs`
            if (!fs.existsSync(logDir)) {
                fs.mkdirSync(logDir)
            }
            const versionDetails = await ipcRenderer.invoke('get-version-details')
            const today = new Date().toISOString().slice(0, 16).replace('T', '-').replace(':', '-')
            const loggerOptions = {
                colorEnabled: true,
                name: `${logDir}/wallet-v${versionDetails.currentVersion}-d${today}.log`,
                levelFilter: 'debug',
                targetExclusions: ['h2', 'hyper', 'rustls', 'message_handler'],
            }
            IotaSdk.initLogger(loggerOptions)

            deleteOldLogs(logDir, versionDetails.currentVersion)
        })
    }
} catch (err) {
    console.error('[Preload Context] Error:', err)
}

function deleteOldLogs(path, currentVersion) {
    const files = fs.readdirSync(path)
    const dayInMilliSeconds = 1000 * 60 * 60 * 24

    files.forEach((file) => {
        const filePath = path + '/' + file
        const stat = fs.statSync(filePath)

        const isOlderThan30Days = new Date() - new Date(stat.mtime) > 30 * dayInMilliSeconds
        const version = file.match(/wallet-v((\w*.)*)-d((\w*.)*).log/)?.[1]
        const isDifferentVersion = version !== currentVersion
        if (isDifferentVersion || isOlderThan30Days) {
            fs.unlinkSync(filePath)
        }
    })
}

try {
    // contextBridge doesn't allow passing custom properties & methods on prototype chain
    // https://www.electronjs.org/docs/latest/api/context-bridge
    // This workaround exposes the classes through factory methods
    // The factory method also copies all the prototype methods to the object so that it gets passed through the bridge

    const methodNames = Object.getOwnPropertyNames(IotaSdk.Utils).filter(
        (m) => !['length', 'name', 'prototype'].includes(m)
    )
    const methods = {}

    for (const name of methodNames) {
        methods[name] = (...args) => IotaSdk.Utils[name](...args)
    }

    contextBridge.exposeInMainWorld('__WALLET__API__', {
        ...methods,
        async createSecretManager(options) {
            const manager = IotaSdk.SecretManager.create(options)
            bindMethodsAcrossContextBridge(IotaSdk.SecretManager.prototype, manager)
            return manager
        },
        async getClientFromWallet(id) {
            const wallet = wallets[id]
            // Why is this here?:
            // We cannot create classes from exposed functions
            // https://www.electronjs.org/docs/latest/api/context-bridge
            const client = await wallet.getClient()
            bindMethodsAcrossContextBridge(IotaSdk.Client.prototype, client)
            return client
        },
        async getWallet(id, walletOptions) {
            let wallet = wallets[id]
            if (!wallet) {
                wallet = await IotaSdk.Wallet.create(walletOptions)
                wallet.id = id
                wallets[id] = wallet
                bindMethodsAcrossContextBridge(IotaSdk.Wallet.prototype, wallet)
            }
            return wallet
        },
        async deleteWallet(id) {
            if (id && id in wallets) {
                const wallet = wallets[id]
                await wallet.stopBackgroundSync()
                await wallet.destroy()
                delete wallets[id]
            }
        },
        async clearWalletsFromMemory() {
            for (const [id, wallet] of Object.entries(wallets)) {
                await wallet.stopBackgroundSync()
                await wallet.destroy()
                delete wallets[id]
            }
        },
        async migrateStrongholdSnapshotV2ToV3(currentPath, newPath, currentPassword, newPassword) {
            const snapshotSaltV2 = 'wallet.rs'
            const snapshotRoundsV2 = 100
            return IotaSdk.migrateStrongholdSnapshotV2ToV3(
                currentPath,
                newPath,
                snapshotSaltV2,
                snapshotRoundsV2,
                currentPassword,
                newPassword
            )
        },
        async migrateDbChrysalisToStardust(path, pinCode) {
            return IotaSdk.migrateDbChrysalisToStardust(path, pinCode)
        },
    })
    contextBridge.exposeInMainWorld('__ELECTRON__', ElectronApi)
} catch (err) {
    ipcRenderer.invoke('handle-error', '[Preload Context] Error', err)
}

function bindMethodsAcrossContextBridge(prototype, object) {
    const prototypeProperties = Object.getOwnPropertyNames(prototype)
    prototypeProperties.forEach((key) => {
        if (key !== 'constructor') {
            object[key] = object[key].bind(object)
        }
    })
}
