import { BridgeMessage, MessageResponse } from '../../../../backend/api-wrapper/bridge'
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

function sendMessage(message: BridgeMessage): Promise<number> {
  // TODO should this be done on the Java/Swift layer?
  const id = message.id || Math.floor(Math.random() * 99999999)
  return WalletPlugin.sendMessage({
    message: {
      ...message,
      id
    }
  }).then(() => id)
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