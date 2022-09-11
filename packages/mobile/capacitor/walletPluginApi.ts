import { WalletPlugin } from 'firefly-actor-system-capacitor-bindings'
import {
    AccountIdentifier,
    areLatestAddressesUnused as _areLatestAddressesUnused,
    generateAddress as _generateAddress,
    getAccount as _getAccount,
    getAccounts as _getAccounts,
    getBalance as _getBalance,
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
} from '@lib/typings/account'
import { BridgeMessage, CommunicationIds, MessageResponse } from '@lib/typings/bridge'
import { reattach as _reattach, Transfer } from '@lib/typings/message'
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
} from '@lib/typings/migration'
import {
    backup as _backup,
    changeStrongholdPassword as _changeStrongholdPassword,
    Duration,
    generateMnemonic as _generateMnemonic,
    getLedgerDeviceStatus as _getLedgerDeviceStatus,
    getLegacySeedChecksum as _getLegacySeedChecksum,
    getStrongholdStatus as _getStrongholdStatus,
    lockStronghold as _lockStronghold,
    deleteStorage as _deleteStorage,
    restoreBackup as _restoreBackup,
    send as _send,
    setStoragePassword as _setStoragePassword,
    setStrongholdPassword as _setStrongholdPassword,
    setStrongholdPasswordClearInterval as _setStrongholdPasswordClearInterval,
    storeMnemonic as _storeMnemonic,
    verifyMnemonic as _verifyMnemonic,
} from '@lib/typings/wallet'

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

export function init(id: string): {
    destroy: () => void
    removeEventListeners: () => void
} {
    const walletListener = WalletPlugin.addListener('walletEvent', (event) => {
        const { walletResponse } = event
        if (!walletResponse) return
        const parsedResponse = JSON.parse(walletResponse)
        // filter messages without id since the app doesn't use it
        // and avoid throwing unnecessary errors
        if (!parsedResponse?.id) return
        onMessageListeners.forEach((listener) => listener(parsedResponse))
    })
    void WalletPlugin.initialize({
        // storagePath: 'data/data/com.iota.wallet/cache/database',
        actorId: id,
    })
    // for testing purposes, send undefined id to catch all errors responses
    // void WalletPlugin.listen({
    //     actorId: id,
    //     id: '',
    //     event: 'ErrorThrown',
    // })
    return {
        destroy() {
            void WalletPlugin.destroy({ actorId: id })
            void walletListener.remove()
        },
        removeEventListeners() {
            // we cant remove listener because we are working with plugin listener, not with polls
            // investigate what liseners must to be stopped on load at node api
            // void walletListener.remove()
            // we must use here capacitor events kinda app states??
        },
    }
}

type Api = { (__ids: CommunicationIds): Promise<string> }
export const api = {
    setAlias:
        (accountId: AccountIdentifier, newAccountAlias: string): Api =>
        (__ids) =>
            _setAlias(sendMessage, __ids, accountId, newAccountAlias),
    getStrongholdStatus: (): Api => (__ids) => _getStrongholdStatus(sendMessage, __ids),
    lockStronghold: (): Api => (__ids) => _lockStronghold(sendMessage, __ids),
    generateMnemonic: (): Api => (__ids) => _generateMnemonic(sendMessage, __ids),
    storeMnemonic:
        (mnemonic?: string): Api =>
        (__ids) =>
            _storeMnemonic(sendMessage, __ids, {
                signerType: { type: 'Stronghold' },
                mnemonic: mnemonic || null,
            }),
    verifyMnemonic:
        (mnemonic: string): Api =>
        (__ids) =>
            _verifyMnemonic(sendMessage, __ids, mnemonic),
    removeAccount:
        (accountId: AccountIdentifier): Api =>
        (__ids) =>
            _removeAccount(sendMessage, __ids, accountId),
    getAccount:
        (accountId: AccountIdentifier): Api =>
        (__ids) =>
            _getAccount(sendMessage, __ids, accountId),
    getAccounts: (): Api => (__ids) => _getAccounts(sendMessage, __ids),
    syncAccounts:
        (addressIndex?: number, gapLimit?: number, accountDiscoveryThreshold?: number): Api =>
        (__ids) =>
            _syncAccounts(sendMessage, __ids, addressIndex, gapLimit, accountDiscoveryThreshold),
    startBackgroundSync:
        (pollingInterval: Duration, automaticOutputConsolidation: boolean): Api =>
        (__ids) =>
            _startBackgroundSync(sendMessage, __ids, pollingInterval, automaticOutputConsolidation),
    stopBackgroundSync: (): Api => (__ids) => _stopBackgroundSync(sendMessage, __ids),
    areLatestAddressesUnused: (): Api => (__ids) => _areLatestAddressesUnused(sendMessage, __ids),
    generateAddress:
        (accountId: AccountIdentifier): Api =>
        (__ids) =>
            _generateAddress(sendMessage, __ids, accountId),
    getUnusedAddress:
        (accountId: AccountIdentifier): Api =>
        (__ids) =>
            _getUnusedAddress(sendMessage, __ids, accountId),
    listMessages:
        (accountId: AccountIdentifier, filters?: ListMessagesFilter): Api =>
        (__ids) =>
            _listMessages(sendMessage, __ids, accountId, filters),
    listAddresses:
        (accountId: AccountIdentifier, unspent?: boolean): Api =>
        (__ids) =>
            _listAddresses(sendMessage, __ids, accountId, unspent),
    getBalance:
        (accountId: AccountIdentifier): Api =>
        (__ids) =>
            _getBalance(sendMessage, __ids, accountId),
    latestAddress:
        (accountId: AccountIdentifier): Api =>
        (__ids) =>
            _latestAddress(sendMessage, __ids, accountId),
    syncAccount:
        (accountId: AccountIdentifier, options?: SyncAccountOptions): Api =>
        (__ids) =>
            _syncAccount(sendMessage, __ids, accountId, options),
    isLatestAddressUnused:
        (accountId: AccountIdentifier): Api =>
        (__ids) =>
            _isLatestAddressUnused(sendMessage, __ids, accountId),
    reattach:
        (accountId: AccountIdentifier, messageId: string): Api =>
        (__ids) =>
            _reattach(sendMessage, __ids, accountId, messageId),
    backup:
        (destinationPath: string, password: string): Api =>
        (__ids) =>
            _backup(sendMessage, __ids, destinationPath, password),
    restoreBackup:
        (backupPath: string, password: string): Api =>
        (__ids) =>
            _restoreBackup(sendMessage, __ids, backupPath, password),
    setStrongholdPassword:
        (password: string): Api =>
        (__ids) =>
            _setStrongholdPassword(sendMessage, __ids, password),
    changeStrongholdPassword:
        (currentPassword: string, newPassword: string): Api =>
        (__ids) =>
            _changeStrongholdPassword(sendMessage, __ids, {
                currentPassword,
                newPassword,
            }),
    setStoragePassword:
        (password: string): Api =>
        (__ids) =>
            _setStoragePassword(sendMessage, __ids, password),
    deleteStorage: (): Api => (__ids) => _deleteStorage(sendMessage, __ids),
    send:
        (fromAccountId: AccountIdentifier, transfer: Transfer): Api =>
        (__ids) =>
            _send(sendMessage, __ids, fromAccountId, transfer),
    internalTransfer:
        (fromAccountId: AccountIdentifier, toAccountId: AccountIdentifier, amount: number): Api =>
        (__ids) =>
            _internalTransfer(sendMessage, __ids, fromAccountId, toAccountId, amount),
    setStrongholdPasswordClearInterval:
        (interval: Duration): Api =>
        (__ids) =>
            _setStrongholdPasswordClearInterval(sendMessage, __ids, interval),
    getLegacySeedChecksum:
        (seed: string): Api =>
        (__ids) =>
            _getLegacySeedChecksum(sendMessage, __ids, seed),

    // Migration related methods
    getMigrationData:
        (
            seed: string,
            nodes: string[],
            securityLevel?: number,
            initialAddressIndex?: number,
            permanode?: string
        ): Api =>
        (__ids) =>
            _getMigrationData(sendMessage, __ids, seed, nodes, securityLevel, initialAddressIndex, permanode),
    createMigrationBundle:
        (
            seed: string,
            inputAddressIndexes: number[],
            mine: boolean,
            timeoutSeconds: number,
            offset: number,
            logFileName: string
        ): Api =>
        (__ids) =>
            _createMigrationBundle(
                sendMessage,
                __ids,
                seed,
                inputAddressIndexes,
                mine,
                timeoutSeconds,
                offset,
                logFileName
            ),
    sendMigrationBundle:
        (nodes: string[], bundleHash: string, mwm: number): Api =>
        (__ids) =>
            _sendMigrationBundle(sendMessage, __ids, nodes, bundleHash, mwm),
    getMigrationAddress:
        (prompt: boolean, accountIndex: number): Api =>
        (__ids) =>
            _getMigrationAddreess(sendMessage, __ids, prompt, accountIndex),
    mineBundle:
        (bundle: string[], spentBundleHashes: string[], securityLevel: number, timeout: number, offset: number): Api =>
        (__ids) =>
            _mineBundle(sendMessage, __ids, bundle, spentBundleHashes, securityLevel, timeout, offset),
    getLedgerMigrationData:
        (addresses: AddressInput[], nodes: string[], permanode: string, securityLevel: number): Api =>
        (__ids) =>
            _getLedgerMigrationData(sendMessage, __ids, addresses, nodes, permanode, securityLevel),
    sendLedgerMigrationBundle:
        (nodes: string[], bundle: string[], mwm: number): Api =>
        (__ids) =>
            _sendLedgerMigrationBundle(sendMessage, __ids, nodes, bundle, mwm),
    getLegacyAddressChecksum:
        (address: string): Api =>
        (__ids) =>
            _getLegacyAddressChecksum(sendMessage, __ids, address),

    // Event emitters
    onError: (): Api => (__ids) =>
        WalletPlugin.listen({
            actorId: __ids.actorId,
            id: __ids.messageId,
            event: 'ErrorThrown',
        }),
    onBalanceChange: (): Api => (__ids) =>
        WalletPlugin.listen({
            actorId: __ids.actorId,
            id: __ids.messageId,
            event: 'BalanceChange',
        }),
    onNewTransaction: (): Api => (__ids) =>
        WalletPlugin.listen({
            actorId: __ids.actorId,
            id: __ids.messageId,
            event: 'NewTransaction',
        }),
    onConfirmationStateChange: (): Api => (__ids) =>
        WalletPlugin.listen({
            actorId: __ids.actorId,
            id: __ids.messageId,
            event: 'ConfirmationStateChange',
        }),
    onReattachment: (): Api => (__ids) =>
        WalletPlugin.listen({
            actorId: __ids.actorId,
            id: __ids.messageId,
            event: 'Reattachment',
        }),
    onBroadcast: (): Api => (__ids) =>
        WalletPlugin.listen({
            actorId: __ids.actorId,
            id: __ids.messageId,
            event: 'Broadcast',
        }),
    onStrongholdStatusChange: (): Api => (__ids) =>
        WalletPlugin.listen({
            actorId: __ids.actorId,
            id: __ids.messageId,
            event: 'StrongholdStatusChange',
        }),
    onTransferProgress: (): Api => (__ids) =>
        WalletPlugin.listen({
            actorId: __ids.actorId,
            id: __ids.messageId,
            event: 'TransferProgress',
        }),
    onLedgerAddressGeneration: (): Api => () =>
        new Promise<string>((resolve) => {
            resolve('onLedgerAddressGeneration')
        }),
    // TODO not implemented on lib.rs
    // WalletPlugin.listen({
    //     actorId: __ids.actorId,
    //     id: __ids.messageId,
    //     event: 'LedgerAddressGeneration',
    // })
    getLedgerDeviceStatus:
        (isSimulator: boolean): Api =>
        (__ids) =>
            _getLedgerDeviceStatus(sendMessage, __ids, isSimulator),
    onMigrationProgress: (): Api => (__ids) =>
        WalletPlugin.listen({
            actorId: __ids.actorId,
            id: __ids.messageId,
            event: 'MigrationProgress',
        }),
}
