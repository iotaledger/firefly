import type {
  BridgeMessage,
  BridgeResponse
} from '../../../../backend/api-wrapper/bridge'
import {
  AccountToCreate,
  Account,
  AccountIdentifier,
  createAccount as _createAccount,
  removeAccount as _removeAccount,
  getAccount as _getAccount,
  syncAccounts as _syncAccounts,
  internalTransfer as _internalTransfer
} from '../../../../backend/api-wrapper/account'
import {
  Message,
  ListMessageFilter,
  Transfer,
  listMessages as _listMessages,
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

function sendMessage(message: BridgeMessage): Promise<any> {
  return WalletPlugin.sendMessage({
    message
  }).then(response => {
    if (response && response.type === 'Error') {
      return Promise.reject(response)
    } else {
      return response
    }
  })
}

export function init() {
  WalletPlugin.initialize({
    storagePath: 'data/data/com.iota.wallet/cache/database'
  })
}

export function createAccount(account: AccountToCreate): Promise<BridgeResponse<Account>> {
  return _createAccount(sendMessage, account)
}

export function removeAccount(accountId: AccountIdentifier): Promise<BridgeResponse<any>> {
  return _removeAccount(sendMessage, accountId)
}

export function getAccount(accountId: AccountIdentifier): Promise<BridgeResponse<Account>> {
  return _getAccount(sendMessage, accountId)
}

export function syncAccounts(): Promise<BridgeResponse<any>> {
  return _syncAccounts(sendMessage)
}

export function listMessages(accountId: AccountIdentifier, filter: ListMessageFilter, count: number, from = 0): Promise<BridgeResponse<Message[]>> {
  return _listMessages(sendMessage, accountId, filter, count, from)
}

export function reattach(accountId: AccountIdentifier, messageId: string): Promise<BridgeResponse<any>> {
  return _reattach(sendMessage, accountId, messageId)
}

export function backup(destinationPath: string): Promise<BridgeResponse<any>> {
  return _backup(sendMessage, destinationPath)
}

export function restoreBackup(backupPath: string): Promise<BridgeResponse<any>> {
  return _restoreBackup(sendMessage, backupPath)
}

export function setStrongholdPassword(password: string): Promise<BridgeResponse<any>> {
  return _setStrongholdPassword(sendMessage, password)
}

export function send(fromAccountId: AccountIdentifier, transfer: Transfer): Promise<BridgeResponse<Message>> {
  return _send(sendMessage, fromAccountId, transfer)
}

export function internalTransfer(fromAccountId: AccountIdentifier, toAccountId: AccountIdentifier, amount: number): Promise<BridgeResponse<Message>> {
  return _internalTransfer(sendMessage, fromAccountId, toAccountId, amount)
}