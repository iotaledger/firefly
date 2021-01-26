import { BridgeMessage, MessageResponse, CommunicationIds } from '../../api-wrapper/bridge'
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
  areLatestAddressesUnused as _areLatestAddressesUnused
} from '../../api-wrapper/account'
import {
  Transfer,
  reattach as _reattach
} from '../../api-wrapper/message'
import {
  LoggerConfig,
  backup as _backup,
  restoreBackup as _restoreBackup,
  setStrongholdPassword as _setStrongholdPassword,
  setStoragePassword as _setStoragePassword,
  send as _send,
  generateMnemonic as _generateMnemonic,
  storeMnemonic as _storeMnemonic,
  verifyMnemonic as _verifyMnemonic,
  getStrongholdStatus as _getStrongholdStatus
} from '../../api-wrapper/wallet'

const addon = require('../native')
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
  const id = message.id;

  return new Promise(resolve => addon.sendMessage(JSON.stringify(message), () => resolve(id)))
}

export function init(id: string, storagePath?: string) {
  const runtime = storagePath ? new addon.ActorSystem(id, storagePath) : new addon.ActorSystem(id)
  let destroyed = false
  _poll(runtime, (error, data) => {
    const message = error || data
    mailbox.push(message)
    onMessageListeners.forEach(listener => listener(message))
  }, () => destroyed)
  return {
    destroy() {
      destroyed = true
      runtime.destroy()
    }
  }
}

export function onMessage(cb: (payload: any) => void) {
  onMessageListeners.push(cb)
}

export function initLogger(config: LoggerConfig) {
  addon.initLogger(JSON.stringify(config))
}

export const api = {
  getStrongholdStatus: function (): ((__ids: CommunicationIds) => Promise<string>) {
    return (__ids: CommunicationIds) => _getStrongholdStatus(sendMessage, __ids)
  },
  generateMnemonic: function (): ((__ids: CommunicationIds) => Promise<string>) {
    return (__ids: CommunicationIds) => _generateMnemonic(sendMessage, __ids)
  },
  storeMnemonic: function (mnemonic?: string): ((__ids: CommunicationIds) => Promise<string>) {
    return (__ids: CommunicationIds) => _storeMnemonic(sendMessage, __ids, {
      signerType: { type: 'Stronghold' },
      mnemonic: mnemonic || null
    })
  },
  verifyMnemonic: function (mnemonic: string): ((__ids: CommunicationIds) => Promise<string>) {
    return (__ids: CommunicationIds) => _verifyMnemonic(sendMessage, __ids, mnemonic)
  },
  createAccount: function (account: AccountToCreate): ((__ids: CommunicationIds) => Promise<string>) {
    return (__ids: CommunicationIds) => _createAccount(sendMessage, __ids, account)
  },
  removeAccount: function (accountId: AccountIdentifier): ((__ids: CommunicationIds) => Promise<string>) {
    return (__ids: CommunicationIds) => _removeAccount(sendMessage, __ids, accountId)
  },
  getAccount: function (accountId: AccountIdentifier): ((__ids: CommunicationIds) => Promise<string>) {
    return (__ids: CommunicationIds) => _getAccount(sendMessage, __ids, accountId)
  },
  getAccounts: function (): ((__ids: CommunicationIds) => Promise<string>) {
    return (__ids: CommunicationIds) => _getAccounts(sendMessage, __ids)
  },
  syncAccounts: function (): ((__ids: CommunicationIds) => Promise<string>) {
    return (__ids: CommunicationIds) => _syncAccounts(sendMessage, __ids)
  },
  areLatestAddressesUnused: function (): ((__ids: CommunicationIds) => Promise<string>) {
    return (__ids: CommunicationIds) => _areLatestAddressesUnused(sendMessage, __ids)
  },
  generateAddress: function (accountId: AccountIdentifier): ((__ids: CommunicationIds) => Promise<string>) {
    return (__ids: CommunicationIds) => _generateAddress(sendMessage, __ids, accountId)
  },
  getUnusedAddress: function (accountId: AccountIdentifier): ((__ids: CommunicationIds) => Promise<string>) {
    return (__ids: CommunicationIds) => _getUnusedAddress(sendMessage, __ids, accountId)
  },
  listMessages: function (accountId: AccountIdentifier, filters?: ListMessagesFilter): ((__ids: CommunicationIds) => Promise<string>) {
    return (__ids: CommunicationIds) => _listMessages(sendMessage, __ids, accountId, filters)
  },
  listAddresses: function (accountId: AccountIdentifier, unspent?: boolean): ((__ids: CommunicationIds) => Promise<string>) {
    return (__ids: CommunicationIds) => _listAddresses(sendMessage, __ids, accountId, unspent)
  },
  getBalance: function (accountId: AccountIdentifier): ((__ids: CommunicationIds) => Promise<string>) {
    return (__ids: CommunicationIds) => _getBalance(sendMessage, __ids, accountId)
  },
  latestAddress: function (accountId: AccountIdentifier): ((__ids: CommunicationIds) => Promise<string>) {
    return (__ids: CommunicationIds) => _latestAddress(sendMessage, __ids, accountId)
  },
  syncAccount: function (accountId: AccountIdentifier, options?: SyncAccountOptions): ((__ids: CommunicationIds) => Promise<string>) {
    return (__ids: CommunicationIds) => _syncAccount(sendMessage, __ids, accountId, options)
  },
  isLatestAddressUnused: function (accountId: AccountIdentifier): ((__ids: CommunicationIds) => Promise<string>) {
    return (__ids: CommunicationIds) => _isLatestAddressUnused(sendMessage, __ids, accountId)
  },
  reattach: function (accountId: AccountIdentifier, messageId: string): ((__ids: CommunicationIds) => Promise<string>) {
    return (__ids: CommunicationIds) => _reattach(sendMessage, __ids, accountId, messageId)
  },
  backup: function (destinationPath: string): ((__ids: CommunicationIds) => Promise<string>) {
    return (__ids: CommunicationIds) => _backup(sendMessage, __ids, destinationPath)
  },
  restoreBackup: function (backupPath: string, password: string): ((__ids: CommunicationIds) => Promise<string>) {
    return (__ids: CommunicationIds) => _restoreBackup(sendMessage, __ids, backupPath, password)
  },
  setStrongholdPassword: function (password: string): ((__ids: CommunicationIds) => Promise<string>) {
    return (__ids: CommunicationIds) => _setStrongholdPassword(sendMessage, __ids, password)
  },
  setStoragePassword: function (password: string): ((__ids: CommunicationIds) => Promise<string>) {
    return (__ids: CommunicationIds) => _setStoragePassword(sendMessage, __ids, password)
  },
  send: function (fromAccountId: AccountIdentifier, transfer: Transfer): ((__ids: CommunicationIds) => Promise<string>) {
    return (__ids: CommunicationIds) => _send(sendMessage, __ids, fromAccountId, transfer)
  },
  internalTransfer: function (fromAccountId: AccountIdentifier, toAccountId: AccountIdentifier, amount: number): ((__ids: CommunicationIds) => Promise<string>) {
    return (__ids: CommunicationIds) => _internalTransfer(sendMessage, __ids, fromAccountId, toAccountId, amount)
  },
  onError: function (): ((__ids: CommunicationIds) => Promise<string>) {
    return (__ids: CommunicationIds) => addon.listen(__ids.actorId, __ids.messageId, 'ErrorThrown')
  },
  onBalanceChange: function (): ((__ids: CommunicationIds) => Promise<string>) {
    return (__ids: CommunicationIds) => addon.listen(__ids.actorId, __ids.messageId, 'BalanceChange')
  },
  onNewTransaction: function (): ((__ids: CommunicationIds) => Promise<string>) {
    return (__ids: CommunicationIds) => addon.listen(__ids.actorId, __ids.messageId, 'NewTransaction')
  },
  onConfirmationStateChange: function (): ((__ids: CommunicationIds) => Promise<string>) {
    return (__ids: CommunicationIds) => addon.listen(__ids.actorId, __ids.messageId, 'ConfirmationStateChange')
  },
  onReattachment: function (): ((__ids: CommunicationIds) => Promise<string>) {
    return (__ids: CommunicationIds) => addon.listen(__ids.actorId, __ids.messageId, 'Reattachment')
  },
  onBroadcast: function (): ((__ids: CommunicationIds) => Promise<string>) {
    return (__ids: CommunicationIds) => addon.listen(__ids.actorId, __ids.messageId, 'Broadcast')
  },
  onStrongholdStatusChange: function (): ((__ids: CommunicationIds) => Promise<string>) {
    return (__ids: CommunicationIds) => addon.listen(__ids.actorId, __ids.messageId, 'StrongholdStatusChange')
  },
};
