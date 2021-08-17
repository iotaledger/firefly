import { BridgeMessage, MessageResponse, CommunicationIds } from '../../../shared/lib/typings/bridge'
import {
    AccountToCreate,
    AccountIdentifier,
    ListMessagesFilter,
    SyncAccountOptions,
    createAccount as _createAccount,
    removeAccount as _removeAccount,
    getAccount as _getAccount,
    getAccounts as _getAccounts,
    syncAccounts as _syncAccounts,
    internalTransfer as _internalTransfer,
    generateAddress as _generateAddress,
    getUnusedAddress as _getUnusedAddress,
    listMessages as _listMessages,
    listAddresses as _listAddresses,
    getBalance as _getBalance,
    latestAddress as _latestAddress,
    syncAccount as _syncAccount,
    isLatestAddressUnused as _isLatestAddressUnused,
    areLatestAddressesUnused as _areLatestAddressesUnused,
    setAlias as _setAlias,
    getNodeInfo as _getNodeInfo,
    startBackgroundSync as _startBackgroundSync,
    stopBackgroundSync as _stopBackgroundSync,
} from '../../../shared/lib/typings/account'
import { Transfer, reattach as _reattach } from '../../../shared/lib/typings/message'
import {
    getMigrationData as _getMigrationData,
    createMigrationBundle as _createMigrationBundle,
    sendMigrationBundle as _sendMigrationBundle,
    getMigrationAddress as _getMigrationAddreess,
    mineBundle as _mineBundle,
    getLedgerMigrationData as _getLedgerMigrationData,
    sendLedgerMigrationBundle as _sendLedgerMigrationBundle,
    getLegacyAddressChecksum as _getLegacyAddressChecksum,
    AddressInput,
} from '../../../shared/lib/typings/migration'
import {
    LoggerConfig,
    Duration,
    backup as _backup,
    restoreBackup as _restoreBackup,
    setStrongholdPassword as _setStrongholdPassword,
    setStoragePassword as _setStoragePassword,
    send as _send,
    generateMnemonic as _generateMnemonic,
    storeMnemonic as _storeMnemonic,
    verifyMnemonic as _verifyMnemonic,
    getStrongholdStatus as _getStrongholdStatus,
    removeStorage as _removeStorage,
    lockStronghold as _lockStronghold,
    changeStrongholdPassword as _changeStrongholdPassword,
    setClientOptions as _setClientOptions,
    getLedgerDeviceStatus as _getLedgerDeviceStatus,
    setStrongholdPasswordClearInterval as _setStrongholdPasswordClearInterval,
    getLegacySeedChecksum as _getLegacySeedChecksum,
} from '../../../shared/lib/typings/wallet'
import { ClientOptions } from '../../../shared/lib/typings/client'
import { NodeAuth } from '../../../shared/lib/typings/node'

const addon = require('../index.node')
const mailbox = []
const onMessageListeners: ((payload: MessageResponse) => void)[] = []

function _poll(runtime: typeof addon.ActorSystem, cb: (error: string, data: any) => void, shouldStop: () => boolean) {
    runtime.poll((err: string, data: string) => {
        cb(err, err ? null : JSON.parse(data))
        if (!shouldStop()) {
            _poll(runtime, cb, shouldStop)
        }
    })
}

function sendMessage(message: BridgeMessage): Promise<string> {
    const id = message.id

    return new Promise((resolve) => addon.sendMessage(JSON.stringify(message), () => resolve(id)))
}

export function init(id: string, storagePath?: string) {
    const runtime = storagePath ? new addon.ActorSystem(id, storagePath) : new addon.ActorSystem(id)
    let destroyed = false
    _poll(
        runtime,
        (error, data) => {
            const message = error || data
            mailbox.push(message)
            onMessageListeners.forEach((listener) => listener(message))
        },
        () => destroyed
    )
    return {
        destroy() {
            destroyed = true
            runtime.destroy()
        },
        removeEventListeners() {
            runtime.removeEventListeners()
        },
    }
}

export function onMessage(cb: (payload: any) => void) {
    onMessageListeners.push(cb)
}

export function initLogger(config: LoggerConfig) {
    addon.initLogger(JSON.stringify(config))
}

export const api = {
    setAlias: function (
        accountId: AccountIdentifier,
        newAccountAlias: string
    ): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _setAlias(sendMessage, __ids, accountId, newAccountAlias)
    },
    getStrongholdStatus: function (): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _getStrongholdStatus(sendMessage, __ids)
    },
    lockStronghold: function (): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _lockStronghold(sendMessage, __ids)
    },
    generateMnemonic: function (): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _generateMnemonic(sendMessage, __ids)
    },
    storeMnemonic: function (mnemonic?: string): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) =>
            _storeMnemonic(sendMessage, __ids, {
                signerType: { type: 'Stronghold' },
                mnemonic: mnemonic || null,
            })
    },
    verifyMnemonic: function (mnemonic: string): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _verifyMnemonic(sendMessage, __ids, mnemonic)
    },
    createAccount: function (account: AccountToCreate): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _createAccount(sendMessage, __ids, account)
    },
    removeAccount: function (accountId: AccountIdentifier): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _removeAccount(sendMessage, __ids, accountId)
    },
    getAccount: function (accountId: AccountIdentifier): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _getAccount(sendMessage, __ids, accountId)
    },
    getAccounts: function (): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _getAccounts(sendMessage, __ids)
    },
    syncAccounts: function (
        addressIndex?: number,
        gapLimit?: number,
        accountDiscoveryThreshold?: number
    ): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) =>
            _syncAccounts(sendMessage, __ids, addressIndex, gapLimit, accountDiscoveryThreshold)
    },
    startBackgroundSync: function (
        pollingInterval: Duration,
        automaticOutputConsolidation: boolean
    ): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) =>
            _startBackgroundSync(sendMessage, __ids, pollingInterval, automaticOutputConsolidation)
    },
    stopBackgroundSync: function (): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _stopBackgroundSync(sendMessage, __ids)
    },
    areLatestAddressesUnused: function (): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _areLatestAddressesUnused(sendMessage, __ids)
    },
    generateAddress: function (accountId: AccountIdentifier): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _generateAddress(sendMessage, __ids, accountId)
    },
    getUnusedAddress: function (accountId: AccountIdentifier): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _getUnusedAddress(sendMessage, __ids, accountId)
    },
    listMessages: function (
        accountId: AccountIdentifier,
        filters?: ListMessagesFilter
    ): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _listMessages(sendMessage, __ids, accountId, filters)
    },
    listAddresses: function (
        accountId: AccountIdentifier,
        unspent?: boolean
    ): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _listAddresses(sendMessage, __ids, accountId, unspent)
    },
    getBalance: function (accountId: AccountIdentifier): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _getBalance(sendMessage, __ids, accountId)
    },
    latestAddress: function (accountId: AccountIdentifier): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _latestAddress(sendMessage, __ids, accountId)
    },
    syncAccount: function (
        accountId: AccountIdentifier,
        options?: SyncAccountOptions
    ): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _syncAccount(sendMessage, __ids, accountId, options)
    },
    isLatestAddressUnused: function (accountId: AccountIdentifier): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _isLatestAddressUnused(sendMessage, __ids, accountId)
    },
    reattach: function (accountId: AccountIdentifier, messageId: string): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _reattach(sendMessage, __ids, accountId, messageId)
    },
    backup: function (destinationPath: string, password: string): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _backup(sendMessage, __ids, destinationPath, password)
    },
    restoreBackup: function (backupPath: string, password: string): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _restoreBackup(sendMessage, __ids, backupPath, password)
    },
    setStrongholdPassword: function (password: string): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _setStrongholdPassword(sendMessage, __ids, password)
    },
    changeStrongholdPassword: function (
        currentPassword: string,
        newPassword: string
    ): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) =>
            _changeStrongholdPassword(sendMessage, __ids, {
                currentPassword,
                newPassword,
            })
    },
    setStoragePassword: function (password: string): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _setStoragePassword(sendMessage, __ids, password)
    },
    removeStorage: function (): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _removeStorage(sendMessage, __ids)
    },
    send: function (
        fromAccountId: AccountIdentifier,
        transfer: Transfer
    ): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _send(sendMessage, __ids, fromAccountId, transfer)
    },
    internalTransfer: function (
        fromAccountId: AccountIdentifier,
        toAccountId: AccountIdentifier,
        amount: number
    ): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _internalTransfer(sendMessage, __ids, fromAccountId, toAccountId, amount)
    },
    setClientOptions: function (options: ClientOptions): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _setClientOptions(sendMessage, __ids, options)
    },
    setStrongholdPasswordClearInterval: function (interval: Duration): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _setStrongholdPasswordClearInterval(sendMessage, __ids, interval)
    },
    getLegacySeedChecksum: function (seed: string): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _getLegacySeedChecksum(sendMessage, __ids, seed)
    },

    // Migration related methods
    getMigrationData: function (
        seed: string,
        nodes: string[],
        securityLevel?: number,
        initialAddressIndex?: number,
        permanode?: string
    ): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) =>
            _getMigrationData(sendMessage, __ids, seed, nodes, securityLevel, initialAddressIndex, permanode)
    },
    createMigrationBundle: function (
        seed: string,
        inputAddressIndexes: number[],
        mine: boolean,
        timeoutSeconds: number,
        offset: number,
        logFileName: string
    ): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) =>
            _createMigrationBundle(
                sendMessage,
                __ids,
                seed,
                inputAddressIndexes,
                mine,
                timeoutSeconds,
                offset,
                logFileName
            )
    },
    sendMigrationBundle: function (
        nodes: string[],
        bundleHash: string,
        mwm: number
    ): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _sendMigrationBundle(sendMessage, __ids, nodes, bundleHash, mwm)
    },
    getMigrationAddress: function (
        prompt: boolean,
        accountIndex: number
    ): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _getMigrationAddreess(sendMessage, __ids, prompt, accountIndex)
    },
    mineBundle: function (
        bundle: string[],
        spentBundleHashes: string[],
        securityLevel: number,
        timeout: number,
        offset: number
    ): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) =>
            _mineBundle(sendMessage, __ids, bundle, spentBundleHashes, securityLevel, timeout, offset)
    },
    getLedgerMigrationData: function (
        addresses: AddressInput[],
        nodes: string[],
        permanode: string,
        securityLevel: number
    ): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) =>
            _getLedgerMigrationData(sendMessage, __ids, addresses, nodes, permanode, securityLevel)
    },
    sendLedgerMigrationBundle: function (
        nodes: string[],
        bundle: string[],
        mwm: number
    ): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _sendLedgerMigrationBundle(sendMessage, __ids, nodes, bundle, mwm)
    },
    getNodeInfo: function (
        accountId: AccountIdentifier,
        url?: string,
        auth?: NodeAuth
    ): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _getNodeInfo(sendMessage, __ids, accountId, url, auth)
    },
    getLegacyAddressChecksum: function (address: string): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _getLegacyAddressChecksum(sendMessage, __ids, address)
    },
    // Event emitters
    onError: function (): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => addon.listen(__ids.actorId, __ids.messageId, 'ErrorThrown')
    },
    onBalanceChange: function (): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => addon.listen(__ids.actorId, __ids.messageId, 'BalanceChange')
    },
    onNewTransaction: function (): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => addon.listen(__ids.actorId, __ids.messageId, 'NewTransaction')
    },
    onConfirmationStateChange: function (): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => addon.listen(__ids.actorId, __ids.messageId, 'ConfirmationStateChange')
    },
    onReattachment: function (): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => addon.listen(__ids.actorId, __ids.messageId, 'Reattachment')
    },
    onBroadcast: function (): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => addon.listen(__ids.actorId, __ids.messageId, 'Broadcast')
    },
    onStrongholdStatusChange: function (): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => addon.listen(__ids.actorId, __ids.messageId, 'StrongholdStatusChange')
    },
    onTransferProgress: function (): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => addon.listen(__ids.actorId, __ids.messageId, 'TransferProgress')
    },
    onLedgerAddressGeneration: function (): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => addon.listen(__ids.actorId, __ids.messageId, 'LedgerAddressGeneration')
    },
    getLedgerDeviceStatus: function (isSimulator: boolean): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _getLedgerDeviceStatus(sendMessage, __ids, isSimulator)
    },
    onMigrationProgress: function (): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => addon.listen(__ids.actorId, __ids.messageId, 'MigrationProgress')
    },
}
