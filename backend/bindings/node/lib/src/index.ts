import { BridgeMessage, BridgeResponse } from '../../../../api-wrapper/bridge'
import {
  AccountToCreate,
  Account,
  AccountIdentifier,
  createAccount as _createAccount,
  removeAccount as _removeAccount,
  getAccount as _getAccount,
  syncAccounts as _syncAccounts,
  internalTransfer as _internalTransfer
} from '../../../../api-wrapper/account'
import {
  Message,
  ListMessageFilter,
  Transfer,
  listMessages as _listMessages,
  reattach as _reattach
} from '../../../../api-wrapper/message'
import {
  backup as _backup,
  restoreBackup as _restoreBackup,
  setStrongholdPassword as _setStrongholdPassword,
  send as _send
} from '../../../../api-wrapper/wallet'
import * as events from '../../../../api-wrapper/events'

const addon = require('../native')

function sendMessage(message: BridgeMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    addon.sendMessage(JSON.stringify(message), (err: any, res: string) => {
      if (err) {
        reject(err)
      } else {
        const response = JSON.parse(res)
        if (response && response.type === 'Error') {
          reject(response)
        }
        else {
          resolve(response)
        }
      }
    })
  })
}

export function init(storagePath: string = '') {
  addon.init(storagePath)
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

function _poll(emitter: typeof addon.EventEmitter, cb: (error: string, data: any) => void) {
  emitter.poll((err: string, data: string) => {
    cb(err, err ? null : JSON.parse(data))
    _poll(emitter, cb)
  })
}

export function onError(cb: events.Callback<events.ErrorEvent>) {
  _poll(new addon.EventEmitter('ErrorThrown'), cb)
}

export function onBalanceChange(cb: events.Callback<events.BalanceChangeEvent>) {
  _poll(new addon.EventEmitter('BalanceChange'), cb)
}

export function onNewTransaction(cb: events.Callback<events.TransactionEvent>) {
  _poll(new addon.EventEmitter('NewTransaction'), cb)
}

export function onConfirmationStateChange(cb: events.Callback<events.TransactionEvent>) {
  _poll(new addon.EventEmitter('ConfirmationStateChange'), cb)
}

export function onReattachment(cb: events.Callback<events.TransactionEvent>) {
  _poll(new addon.EventEmitter('Reattachment'), cb)
}

export function onBroadcast(cb: events.Callback<events.TransactionEvent>) {
  _poll(new addon.EventEmitter('Broadcast'), cb)
}
