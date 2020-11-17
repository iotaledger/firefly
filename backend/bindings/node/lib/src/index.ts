import { BridgeMessage, MessageResponse } from '../../../../api-wrapper/bridge'
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
} from '../../../../api-wrapper/account'
import {
  Transfer,
  reattach as _reattach
} from '../../../../api-wrapper/message'
import {
  backup as _backup,
  restoreBackup as _restoreBackup,
  setStrongholdPassword as _setStrongholdPassword,
  send as _send
} from '../../../../api-wrapper/wallet'

const addon = require('../native')
const mailbox = []
const onMessageListeners: ((payload: MessageResponse) => void)[] = []

function _poll(runtime: typeof addon.ActorSystem, cb: (error: string, data: any) => void) {
  runtime.poll((err: string, data: string) => {
    cb(err, err ? null : JSON.parse(data))
    _poll(runtime, cb)
  })
}

function sendMessage(message: BridgeMessage): Promise<number> {
  // TODO secure RNG?
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

export const api = {
  createAccount: function (account: AccountToCreate): ((__id: number) => Promise<number>) {
    return (__id: number) => _createAccount(sendMessage, __id, account)
  },
  removeAccount: function (accountId: AccountIdentifier): ((__id: number) => Promise<number>) {
    return (__id: number) => _removeAccount(sendMessage, __id, accountId)
  },
  getAccount: function (accountId: AccountIdentifier): ((__id: number) => Promise<number>) {
    return (__id: number) => _getAccount(sendMessage, __id, accountId)
  },
  getAccounts: function (): ((__id: number) => Promise<number>) {
    return (__id: number) => _getAccounts(sendMessage, __id)
  },
  syncAccounts: function (): ((__id: number) => Promise<number>) {
    return (__id: number) => _syncAccounts(sendMessage, __id)
  },
  generateAddress: function (accountId: AccountIdentifier): ((__id: number) => Promise<number>) {
    return (__id: number) => _generateAddress(sendMessage, __id, accountId)
  },
  listMessages: function (accountId: AccountIdentifier, filters?: ListMessagesFilter): ((__id: number) => Promise<number>) {
    return (__id: number) => _listMessages(sendMessage, __id, accountId, filters)
  },
  listAddresses: function (accountId: AccountIdentifier, unspent?: boolean): ((__id: number) => Promise<number>) {
    return (__id: number) => _listAddresses(sendMessage, __id, accountId, unspent)
  },
  availableBalance: function (accountId: AccountIdentifier): ((__id: number) => Promise<number>) {
    return (__id: number) => _availableBalance(sendMessage, __id, accountId)
  },
  totalBalance: function (accountId: AccountIdentifier): ((__id: number) => Promise<number>) {
    return (__id: number) => _totalBalance(sendMessage, __id, accountId)
  },
  latestAddress: function (accountId: AccountIdentifier): ((__id: number) => Promise<number>) {
    return (__id: number) => _latestAddress(sendMessage, __id, accountId)
  },
  syncAccount: function (accountId: AccountIdentifier, options?: SyncAccountOptions): ((__id: number) => Promise<number>) {
    return (__id: number) => _syncAccount(sendMessage, __id, accountId, options)
  },
  reattach: function (accountId: AccountIdentifier, messageId: string): ((__id: number) => Promise<number>) {
    return (__id: number) => _reattach(sendMessage, __id, accountId, messageId)
  },
  backup: function (destinationPath: string): ((__id: number) => Promise<number>) {
    return (__id: number) => _backup(sendMessage, __id, destinationPath)
  },
  restoreBackup: function (backupPath: string): ((__id: number) => Promise<number>) {
    return (__id: number) => _restoreBackup(sendMessage, __id, backupPath)
  },
  setStrongholdPassword: function (password: string): ((__id: number) => Promise<number>) {
    return (__id: number) => _setStrongholdPassword(sendMessage, __id, password)
  },
  send: function (fromAccountId: AccountIdentifier, transfer: Transfer): ((__id: number) => Promise<number>) {
    return (__id: number) => _send(sendMessage, __id, fromAccountId, transfer)
  },
  internalTransfer: function (fromAccountId: AccountIdentifier, toAccountId: AccountIdentifier, amount: number): ((__id: number) => Promise<number>) {
    return (__id: number) => _internalTransfer(sendMessage, __id, fromAccountId, toAccountId, amount)
  }
};

export function listenToErrorEvents() {
  addon.listen('ErrorThrown')
}

export function listenToBalanceChangeEvents() {
  addon.listen('BalanceChange')
}

export function listenToNewTransactionEvents() {
  addon.listen('NewTransaction')
}

export function listenToConfirmationStateChangeEvents() {
  addon.listen('ConfirmationStateChange')
}

export function listenToReattachmentEvents() {
  addon.listen('Reattachment')
}

export function listenToBroadcastEvents() {
  addon.listen('Broadcast')
}
