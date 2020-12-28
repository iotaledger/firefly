import { BridgeMessage, MessageResponse } from '../../api-wrapper/bridge'
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
  listMessages as _listMessages,
  listAddresses as _listAddresses,
  availableBalance as _availableBalance,
  totalBalance as _totalBalance,
  latestAddress as _latestAddress,
  syncAccount as _syncAccount
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
  send as _send
} from '../../api-wrapper/wallet'

const addon = require('../native')
const mailbox = []
const onMessageListeners: ((payload: MessageResponse) => void)[] = []

function _poll(runtime: typeof addon.ActorSystem, cb: (error: string, data: any) => void) {
  runtime.poll((err: string, data: string) => {
    cb(err, err ? null : JSON.parse(data))
    _poll(runtime, cb)
  })
}

function sendMessage(message: BridgeMessage): Promise<string> {
  const id = message.id;

  return new Promise(resolve => addon.sendMessage(JSON.stringify(message), () => resolve(id)))
}

export function init(storagePath?: string) {
  const runtime = new addon.ActorSystem(storagePath || '')
  _poll(runtime, (error, data) => {
    const message = error || data
    mailbox.push(message)
    onMessageListeners.forEach(listener => listener(message))
  })
}

export function onMessage(cb: (payload: any) => void) {
  onMessageListeners.push(cb)
}

export function initLogger(config: LoggerConfig) {
  addon.initLogger(JSON.stringify(config))
}

export const api = {
  createAccount: function (account: AccountToCreate): ((__id: string) => Promise<string>) {
    return (__id: string) => _createAccount(sendMessage, __id, account)
  },
  removeAccount: function (accountId: AccountIdentifier): ((__id: string) => Promise<string>) {
    return (__id: string) => _removeAccount(sendMessage, __id, accountId)
  },
  getAccount: function (accountId: AccountIdentifier): ((__id: string) => Promise<string>) {
    return (__id: string) => _getAccount(sendMessage, __id, accountId)
  },
  getAccounts: function (): ((__id: string) => Promise<string>) {
    return (__id: string) => _getAccounts(sendMessage, __id)
  },
  syncAccounts: function (): ((__id: string) => Promise<string>) {
    return (__id: string) => _syncAccounts(sendMessage, __id)
  },
  generateAddress: function (accountId: AccountIdentifier): ((__id: string) => Promise<string>) {
    return (__id: string) => _generateAddress(sendMessage, __id, accountId)
  },
  listMessages: function (accountId: AccountIdentifier, filters?: ListMessagesFilter): ((__id: string) => Promise<string>) {
    return (__id: string) => _listMessages(sendMessage, __id, accountId, filters)
  },
  listAddresses: function (accountId: AccountIdentifier, unspent?: boolean): ((__id: string) => Promise<string>) {
    return (__id: string) => _listAddresses(sendMessage, __id, accountId, unspent)
  },
  availableBalance: function (accountId: AccountIdentifier): ((__id: string) => Promise<string>) {
    return (__id: string) => _availableBalance(sendMessage, __id, accountId)
  },
  totalBalance: function (accountId: AccountIdentifier): ((__id: string) => Promise<string>) {
    return (__id: string) => _totalBalance(sendMessage, __id, accountId)
  },
  latestAddress: function (accountId: AccountIdentifier): ((__id: string) => Promise<string>) {
    return (__id: string) => _latestAddress(sendMessage, __id, accountId)
  },
  syncAccount: function (accountId: AccountIdentifier, options?: SyncAccountOptions): ((__id: string) => Promise<string>) {
    return (__id: string) => _syncAccount(sendMessage, __id, accountId, options)
  },
  reattach: function (accountId: AccountIdentifier, messageId: string): ((__id: string) => Promise<string>) {
    return (__id: string) => _reattach(sendMessage, __id, accountId, messageId)
  },
  backup: function (destinationPath: string): ((__id: string) => Promise<string>) {
    return (__id: string) => _backup(sendMessage, __id, destinationPath)
  },
  restoreBackup: function (backupPath: string, password: string): ((__id: string) => Promise<string>) {
    return (__id: string) => _restoreBackup(sendMessage, __id, backupPath, password)
  },
  setStrongholdPassword: function (password: string): ((__id: string) => Promise<string>) {
    return (__id: string) => _setStrongholdPassword(sendMessage, __id, password)
  },
  send: function (fromAccountId: AccountIdentifier, transfer: Transfer): ((__id: string) => Promise<string>) {
    return (__id: string) => _send(sendMessage, __id, fromAccountId, transfer)
  },
  internalTransfer: function (fromAccountId: AccountIdentifier, toAccountId: AccountIdentifier, amount: number): ((__id: string) => Promise<string>) {
    return (__id: string) => _internalTransfer(sendMessage, __id, fromAccountId, toAccountId, amount)
  },
  onError: function (): ((__id: string) => Promise<string>) {
    return (__id: string) => addon.listen(__id, 'ErrorThrown')
  },
  onBalanceChange: function (): ((__id: string) => Promise<string>) {
    return (__id: string) => addon.listen(__id, 'BalanceChange')
  },
  onNewTransaction: function (): ((__id: string) => Promise<string>) {
    return (__id: string) => addon.listen(__id, 'NewTransaction')
  },
  onConfirmationStateChange: function (): ((__id: string) => Promise<string>) {
    return (__id: string) => addon.listen(__id, 'ConfirmationStateChange')
  },
  onReattachment: function (): ((__id: string) => Promise<string>) {
    return (__id: string) => addon.listen(__id, 'Reattachment')
  },
  onBroadcast: function (): ((__id: string) => Promise<string>) {
    return (__id: string) => addon.listen(__id, 'Broadcast')
  },
};
