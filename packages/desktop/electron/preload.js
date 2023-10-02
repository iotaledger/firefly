/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */

import { ipcRenderer, contextBridge } from 'electron'
import ElectronApi from './electronApi'
const IotaSdk = require('@iota/sdk')
import fs from 'fs'
import { initializeSentry } from '../sentry'

const SEND_CRASH_REPORTS = window.process.argv.includes('--send-crash-reports=true')

const profileManagers = {}

// Hook the error handlers as early as possible
window.addEventListener('error', async (event) => {
    const { captureException } = initializeSentry(true)

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
    if (STAGE === 'prod') {
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
        async getNodeInfo(managerId, url, auth) {
            const manager = profileManagers[managerId]
            const client = await manager.getClient()
            const nodeUrl = url ?? (await client.getNode()).url

            const nodeInfo = await client.getNodeInfo(nodeUrl, auth)

            return {
                url: nodeUrl,
                nodeInfo,
            }
        },
        createWallet(id, options) {
            const manager = new IotaSdk.Wallet(options)
            manager.id = id
            profileManagers[id] = manager
            bindMethodsAcrossContextBridge(IotaSdk.Wallet.prototype, manager)
            return manager
        },
        async createAccount(managerId, payload) {
            const manager = profileManagers[managerId]
            const account = await manager.createAccount(payload)
            bindMethodsAcrossContextBridge(IotaSdk.Account.prototype, account)
            return account
        },
        deleteWallet(id) {
            if (id && id in profileManagers) {
                delete profileManagers[id]
            }
        },
        async getAccount(managerId, index) {
            const manager = profileManagers[managerId]
            const account = await manager.getAccount(index)
            bindMethodsAcrossContextBridge(IotaSdk.Account.prototype, account)
            return account
        },
        async getAccounts(managerId) {
            const manager = profileManagers[managerId]
            const accounts = await manager.getAccounts()
            accounts.forEach((account) => bindMethodsAcrossContextBridge(IotaSdk.Account.prototype, account))
            return accounts
        },
        async recoverAccounts(managerId, payload) {
            const manager = profileManagers[managerId]
            const accounts = await manager.recoverAccounts(...Object.values(payload))
            accounts.forEach((account) => bindMethodsAcrossContextBridge(IotaSdk.Account.prototype, account))
            return accounts
        },
        async getClient(managerId) {
            const manager = profileManagers[managerId]
            const client = await manager.getClient()
            bindMethodsAcrossContextBridge(IotaSdk.Client.prototype, client)

            return client
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
