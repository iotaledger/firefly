import { WalletPlugin } from 'wallet-actor-system-capacitor-binding'
import {
    AccountIdentifier,
    AccountToCreate,
    areLatestAddressesUnused as _areLatestAddressesUnused,
    createAccount as _createAccount,
    generateAddress as _generateAddress,
    getAccount as _getAccount,
    getAccounts as _getAccounts,
    getBalance as _getBalance,
    getNodeInfo as _getNodeInfo,
    getUnusedAddress as _getUnusedAddress,
    internalTransfer as _internalTransfer,
    isLatestAddressUnused as _isLatestAddressUnused,
    latestAddress as _latestAddress,
    listAddresses as _listAddresses,
    listMessages as _listMessages,
    ListMessagesFilter,
    removeAccount as _removeAccount,
    setAlias as _setAlias,
    startBackgroundSync as _startBackgroundSync,
    stopBackgroundSync as _stopBackgroundSync,
    syncAccount as _syncAccount,
    SyncAccountOptions,
    syncAccounts as _syncAccounts,
} from '../../shared/lib/typings/account'
import type { BridgeMessage, CommunicationIds, MessageResponse } from '../../shared/lib/typings/bridge'
import type { ClientOptions } from '../../shared/lib/typings/client'
import { reattach as _reattach, Transfer } from '../../shared/lib/typings/message'
import type { NodeAuth } from '../../shared/lib/typings/node'
import {
    backup as _backup,
    changeStrongholdPassword as _changeStrongholdPassword,
    Duration,
    generateMnemonic as _generateMnemonic,
    getLedgerDeviceStatus as _getLedgerDeviceStatus,
    getLegacySeedChecksum as _getLegacySeedChecksum,
    getStrongholdStatus as _getStrongholdStatus,
    lockStronghold as _lockStronghold,
    removeStorage as _removeStorage,
    restoreBackup as _restoreBackup,
    send as _send,
    setClientOptions as _setClientOptions,
    setStoragePassword as _setStoragePassword,
    setStrongholdPassword as _setStrongholdPassword,
    setStrongholdPasswordClearInterval as _setStrongholdPasswordClearInterval,
    storeMnemonic as _storeMnemonic,
    verifyMnemonic as _verifyMnemonic,
} from '../../shared/lib/typings/wallet'

const onMessageListeners: ((payload: MessageResponse) => void)[] = []

async function sendMessage(message: BridgeMessage): Promise<string> {
    const { id } = message
    await WalletPlugin.sendMessage({
        message: {
            ...message,
            id,
        },
    })
    return id
}

export function onMessage(cb: (payload: MessageResponse) => void): void {
    onMessageListeners.push(cb)
}

// export function initLogger(config: LoggerConfig): void {
//     WalletPlugin.initLogger(JSON.stringify(config))
// }

export function init(
    id: string,
    storagePath?: string
): {
    destroy: () => void
    removeEventListeners: () => void
} {
    const walletListener = WalletPlugin.addListener('walletEvent', (message) => {
        const { walletResponse } = message
        const parsedResponse = JSON.parse(walletResponse)
        onMessageListeners.forEach((listener) => listener(parsedResponse))
    })
    void WalletPlugin.initialize({
        // storagePath: 'data/data/com.iota.wallet/cache/database',
        actorId: id,
    })
    // for testing purposes
    // void WalletPlugin.listen({
    //     actorId: id,
    //     id: '',
    //     event: 'ErrorThrown',
    // })
    return {
        destroy() {
            void WalletPlugin.destroy({ actorId: id })
        },
        removeEventListeners() {
            void walletListener.remove()
        },
    }
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

    /*
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
    },*/
    getNodeInfo: function (
        accountId: AccountIdentifier,
        url?: string,
        auth?: NodeAuth
    ): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _getNodeInfo(sendMessage, __ids, accountId, url, auth)
    },
    // getLegacyAddressChecksum: function (address: string): (__ids: CommunicationIds) => Promise<string> {
    //     return (__ids: CommunicationIds) => _getLegacyAddressChecksum(sendMessage, __ids, address)
    // },

    // Event emitters
    onError: function (): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) =>
            WalletPlugin.listen({
                actorId: __ids.actorId,
                id: __ids.messageId,
                event: 'ErrorThrown',
            })
    },
    onBalanceChange: function (): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) =>
            WalletPlugin.listen({
                actorId: __ids.actorId,
                id: __ids.messageId,
                event: 'BalanceChange',
            })
    },
    onNewTransaction: function (): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) =>
            WalletPlugin.listen({
                actorId: __ids.actorId,
                id: __ids.messageId,
                event: 'NewTransaction',
            })
    },
    onConfirmationStateChange: function (): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) =>
            WalletPlugin.listen({
                actorId: __ids.actorId,
                id: __ids.messageId,
                event: 'ConfirmationStateChange',
            })
    },
    onReattachment: function (): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) =>
            WalletPlugin.listen({
                actorId: __ids.actorId,
                id: __ids.messageId,
                event: 'Reattachment',
            })
    },
    onBroadcast: function (): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) =>
            WalletPlugin.listen({
                actorId: __ids.actorId,
                id: __ids.messageId,
                event: 'Broadcast',
            })
    },
    onStrongholdStatusChange: function (): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) =>
            WalletPlugin.listen({
                actorId: __ids.actorId,
                id: __ids.messageId,
                event: 'StrongholdStatusChange',
            })
    },
    onTransferProgress: function (): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) =>
            WalletPlugin.listen({
                actorId: __ids.actorId,
                id: __ids.messageId,
                event: 'TransferProgress',
            })
    },
    onLedgerAddressGeneration: function (): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) =>
            new Promise<string>((resolve) => {
                resolve('onLedgerAddressGeneration')
            })
        // WalletPlugin.listen({
        //     actorId: __ids.actorId,
        //     id: __ids.messageId,
        //     event: 'LedgerAddressGeneration',
        // })
    },
    getLedgerDeviceStatus: function (isSimulator: boolean): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) => _getLedgerDeviceStatus(sendMessage, __ids, isSimulator)
    },
    onMigrationProgress: function (): (__ids: CommunicationIds) => Promise<string> {
        return (__ids: CommunicationIds) =>
            new Promise<string>((resolve) => {
                resolve('onMigrationProgress')
            })
        // WalletPlugin.listen({
        //     actorId: __ids.actorId,
        //     id: __ids.messageId,
        //     event: 'MigrationProgress'
        // })
    },
}
