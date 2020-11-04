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
  const id = message.id || Math.floor(Math.random() * 99999999)
  return new Promise(resolve => addon.sendMessage(JSON.stringify({ ...message, id }), () => resolve(id)))
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

export function createAccount(account: AccountToCreate): Promise<number> {
  return _createAccount(sendMessage, account)
}

export function removeAccount(accountId: AccountIdentifier): Promise<number> {
  return _removeAccount(sendMessage, accountId)
}

export function getAccount(accountId: AccountIdentifier): Promise<number> {
  return _getAccount(sendMessage, accountId)
}

export function getAccounts(): Promise<number> {
  return _getAccounts(sendMessage)
}

export function syncAccounts(): Promise<number> {
  return _syncAccounts(sendMessage)
}

export function generateAddress(accountId: AccountIdentifier): Promise<number> {
  return _generateAddress(sendMessage, accountId)
}

export function listMessages(accountId: AccountIdentifier, filters?: ListMessagesFilter): Promise<number> {
  return _listMessages(sendMessage, accountId, filters)
}

export function listAddresses(accountId: AccountIdentifier, unspent?: boolean): Promise<number> {
  return _listAddresses(sendMessage, accountId, unspent)
}

export function availableBalance(accountId: AccountIdentifier): Promise<number> {
  return _availableBalance(sendMessage, accountId)
}

export function totalBalance(accountId: AccountIdentifier): Promise<number> {
  return _totalBalance(sendMessage, accountId)
}

export function latestAddress(accountId: AccountIdentifier): Promise<number> {
  return _latestAddress(sendMessage, accountId)
}

export function syncAccount(accountId: AccountIdentifier, options?: SyncAccountOptions): Promise<number> {
  return _syncAccount(sendMessage, accountId, options)
}

export function reattach(accountId: AccountIdentifier, messageId: string): Promise<number> {
  return _reattach(sendMessage, accountId, messageId)
}

export function backup(destinationPath: string): Promise<number> {
  return _backup(sendMessage, destinationPath)
}

export function restoreBackup(backupPath: string): Promise<number> {
  return _restoreBackup(sendMessage, backupPath)
}

export function setStrongholdPassword(password: string): Promise<number> {
  return _setStrongholdPassword(sendMessage, password)
}

export function send(fromAccountId: AccountIdentifier, transfer: Transfer): Promise<number> {
  return _send(sendMessage, fromAccountId, transfer)
}

export function internalTransfer(fromAccountId: AccountIdentifier, toAccountId: AccountIdentifier, amount: number): Promise<number> {
  return _internalTransfer(sendMessage, fromAccountId, toAccountId, amount)
}

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
