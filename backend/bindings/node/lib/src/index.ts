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

export function createAccount(__id: number): ((account: AccountToCreate) => Promise<number>) {
  return (account: AccountToCreate) => _createAccount(sendMessage, __id, account)

}

export function removeAccount(__id: number): ((accountId: AccountIdentifier) => Promise<number>) {
  return (accountId: AccountIdentifier) => _removeAccount(sendMessage, __id, accountId)
}

export function getAccount(__id: number): ((accountId: AccountIdentifier) => Promise<number>) {
  return (accountId: AccountIdentifier) => _getAccount(sendMessage, __id, accountId)
}

export function getAccounts(__id: number): (() => Promise<number>) {
  return () => _getAccounts(sendMessage, __id)
}

export function syncAccounts(__id: number): (() => Promise<number>) {
  return () => _syncAccounts(sendMessage, __id)
}

export function generateAddress(__id: number): ((accountId: AccountIdentifier) => Promise<number>) {
  return (accountId: AccountIdentifier) => _generateAddress(sendMessage, __id, accountId)
}

export function listMessages(__id: number): ((accountId: AccountIdentifier, filters?: ListMessagesFilter) => Promise<number>) {
  return (accountId: AccountIdentifier, filters?: ListMessagesFilter) => _listMessages(sendMessage, __id, accountId, filters)
}

export function listAddresses(__id: number): ((accountId: AccountIdentifier, unspent?: boolean) => Promise<number>) {
  return (accountId: AccountIdentifier, unspent?: boolean) => _listAddresses(sendMessage, __id, accountId, unspent)
}

export function availableBalance(__id: number): ((accountId: AccountIdentifier) => Promise<number>) {
  return (accountId: AccountIdentifier) => _availableBalance(sendMessage, __id, accountId)
}

export function totalBalance(__id: number): ((accountId: AccountIdentifier) => Promise<number>) {
  return (accountId: AccountIdentifier) => _totalBalance(sendMessage, __id, accountId)
}

export function latestAddress(__id: number): ((accountId: AccountIdentifier) => Promise<number>) {
  return (accountId: AccountIdentifier) => _latestAddress(sendMessage, __id, accountId)
}

export function syncAccount(__id: number): ((accountId: AccountIdentifier, options?: SyncAccountOptions) => Promise<number>) {
  return (accountId: AccountIdentifier, options?: SyncAccountOptions) => _syncAccount(sendMessage, __id, accountId, options)
}

export function reattach(__id: number): ((accountId: AccountIdentifier, messageId: string) => Promise<number>) {
  return (accountId: AccountIdentifier, messageId: string) => _reattach(sendMessage, __id, accountId, messageId)
}

export function backup(__id: number): ((destinationPath: string) => Promise<number>) {
  return (destinationPath: string) => _backup(sendMessage, __id, destinationPath)
}

export function restoreBackup(__id: number): ((backupPath: string) => Promise<number>) {
  return (backupPath: string) => _restoreBackup(sendMessage, __id, backupPath)
}

export function setStrongholdPassword(__id: number): ((password: string) => Promise<number>) {
  return (password: string) => _setStrongholdPassword(sendMessage, __id, password)
}

export function send(__id: number): ((fromAccountId: AccountIdentifier, transfer: Transfer) => Promise<number>) {
  return (fromAccountId: AccountIdentifier, transfer: Transfer) => _send(sendMessage, __id, fromAccountId, transfer)
}

export function internalTransfer(__id: number): ((fromAccountId: AccountIdentifier, toAccountId: AccountIdentifier, amount: number) => Promise<number>) {
  return (fromAccountId: AccountIdentifier, toAccountId: AccountIdentifier, amount: number) => _internalTransfer(sendMessage, __id, fromAccountId, toAccountId, amount)
}

export function listenToErrorEvents(__id: number) {
  addon.listen(__id, 'ErrorThrown')
}

export function listenToBalanceChangeEvents(__id: number) {
  addon.listen(__id, 'BalanceChange')
}

export function listenToNewTransactionEvents(__id: number) {
  addon.listen(__id, 'NewTransaction')
}

export function listenToConfirmationStateChangeEvents(__id: number) {
  addon.listen(__id, 'ConfirmationStateChange')
}

export function listenToReattachmentEvents(__id: number) {
  addon.listen(__id, 'Reattachment')
}

export function listenToBroadcastEvents(__id: number) {
  addon.listen(__id, 'Broadcast')
}
