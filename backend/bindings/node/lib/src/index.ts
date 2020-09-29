import { BridgeMessage } from '../../../../api-wrapper/bridge'
import { AccountToCreate, Account, createAccount as _createAccount } from '../../../../api-wrapper/account'

const addon = require('../native')

function sendMessage(message: BridgeMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    addon.sendMessage(typeof message === 'string' ? message : JSON.stringify(message), (err: any, res: string) => {
      if (err) {
        reject(err)
      } else {
        resolve(JSON.parse(res))
      }
    })
  })
}

export function init(storagePath: string = '') {
  addon.init(storagePath)
}

export function createAccount(account: AccountToCreate): Promise<Account> {
  return _createAccount(sendMessage, account)
}
