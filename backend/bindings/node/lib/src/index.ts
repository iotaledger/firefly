import { BridgeMessage, BridgeResponse } from '../../../../api-wrapper/bridge'
import {
  AccountToCreate,
  Account,
  AccountIdentifier,
  createAccount as _createAccount,
  removeAccount as _removeAccount,
  getAccount as _getAccount,
  syncAccounts as _syncAccounts
} from '../../../../api-wrapper/account'
import {
  Message,
  ListMessageFilter,
  listMessages as _listMessages,
  reattach as _reattach
} from '../../../../api-wrapper/message'
import {
  backup as _backup,
  restoreBackup as _restoreBackup,
  setStrongholdPassword as _setStrongholdPassword
} from '../../../../api-wrapper/wallet'

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
