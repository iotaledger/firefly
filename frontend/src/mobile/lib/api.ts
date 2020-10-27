import { BridgeMessage, MessageResponse } from '../../../../backend/api-wrapper/bridge'
import {
  AccountToCreate,
  AccountIdentifier,
  ListMessagesFilter,
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
  latestAddress as _latestAddress
} from '../../../../backend/api-wrapper/account'
import {
  Transfer,
  reattach as _reattach
} from '../../../../backend/api-wrapper/message'
import {
  backup as _backup,
  restoreBackup as _restoreBackup,
  setStrongholdPassword as _setStrongholdPassword,
  send as _send
} from '../../../../backend/api-wrapper/wallet'
import {
  Plugins
} from "@capacitor/core"
const {
  WalletPlugin
} = Plugins

const mailbox = []
const onMessageListeners: ((payload: any) => void)[] = []

function sendMessage(message: BridgeMessage): Promise<void> {
  return WalletPlugin.sendMessage({
    message
  })
}

export function onMessage(cb: (payload: MessageResponse) => void) {
  onMessageListeners.push(cb)
}

export function init() {
  WalletPlugin.addListener('walletMessageReceived', message => {
    mailbox.push(message)
    onMessageListeners.forEach(listener => listener(message))
  })
  WalletPlugin.initialize({
    storagePath: 'data/data/com.iota.wallet/cache/database'
  })
}

export function createAccount(account: AccountToCreate): Promise<void> {
  return _createAccount(sendMessage, account)
}

export function removeAccount(accountId: AccountIdentifier): Promise<void> {
  return _removeAccount(sendMessage, accountId)
}

export function getAccount(accountId: AccountIdentifier): Promise<void> {
  return _getAccount(sendMessage, accountId)
}

export function getAccounts(): Promise<void> {
  return _getAccounts(sendMessage)
}

export function syncAccounts(): Promise<void> {
  return _syncAccounts(sendMessage)
}

export function generateAddress(accountId: AccountIdentifier): Promise<void> {
  return _generateAddress(sendMessage, accountId)
}

export function listMessages(accountId: AccountIdentifier, filters?: ListMessagesFilter): Promise<void> {
  return _listMessages(sendMessage, accountId, filters)
}

export function listAddresses(accountId: AccountIdentifier, unspent?: boolean): Promise<void> {
  return _listAddresses(sendMessage, accountId, unspent)
}

export function availableBalance(accountId: AccountIdentifier): Promise<void> {
  return _availableBalance(sendMessage, accountId)
}

export function totalBalance(accountId: AccountIdentifier): Promise<void> {
  return _totalBalance(sendMessage, accountId)
}

export function latestAddress(accountId: AccountIdentifier): Promise<void> {
  return _latestAddress(sendMessage, accountId)
}

export function reattach(accountId: AccountIdentifier, messageId: string): Promise<void> {
  return _reattach(sendMessage, accountId, messageId)
}

export function backup(destinationPath: string): Promise<void> {
  return _backup(sendMessage, destinationPath)
}

export function restoreBackup(backupPath: string): Promise<void> {
  return _restoreBackup(sendMessage, backupPath)
}

export function setStrongholdPassword(password: string): Promise<void> {
  return _setStrongholdPassword(sendMessage, password)
}

export function send(fromAccountId: AccountIdentifier, transfer: Transfer): Promise<void> {
  return _send(sendMessage, fromAccountId, transfer)
}

export function internalTransfer(fromAccountId: AccountIdentifier, toAccountId: AccountIdentifier, amount: number): Promise<void> {
  return _internalTransfer(sendMessage, fromAccountId, toAccountId, amount)
}