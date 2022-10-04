import { IAccount } from '@core/account'
import { RecoverAccountsPayload } from '@core/profile-manager'
import WalletApi from '@iota/wallet'

const profileManagers = {} as WalletApi.AccountManager[]

const ElectronWalletApi = {
    createAccountManager(managerId: string, options: WalletApi.AccountManagerOptions): WalletApi.AccountManager {
        const manager = new WalletApi.AccountManager(options)
        // @ts-expect-error TODO
        manager.id = managerId
        profileManagers[managerId] = manager
        bindMethodsAcrossContextBridge(WalletApi.AccountManager.prototype, manager)
        return manager
    },
    async createAccount(managerId: string, payload: WalletApi.CreateAccountPayload): Promise<IAccount> {
        const manager = profileManagers[managerId]
        const account = await manager.createAccount(payload)
        bindMethodsAcrossContextBridge(WalletApi.Account.prototype, account)
        return account
    },
    deleteAccountManager(managerId: string): void {
        if (managerId && managerId in profileManagers) {
            delete profileManagers[managerId]
        }
    },
    async getAccount(managerId: string, index: number): Promise<IAccount>  {
        const manager = profileManagers[managerId]
        const account = await manager.getAccount(index)
        bindMethodsAcrossContextBridge(WalletApi.Account.prototype, account)
        return account
    },
    async getAccounts(managerId: string): Promise<IAccount[]>  {
        const manager = profileManagers[managerId]
        const accounts = await manager.getAccounts()
        accounts.forEach((account) => bindMethodsAcrossContextBridge(WalletApi.Account.prototype, account))
        return accounts
    },
    async recoverAccounts(managerId: string, payload: RecoverAccountsPayload): Promise<IAccount[]> {
        const manager = profileManagers[managerId]
        const accounts = await manager.recoverAccounts(...Object.values(payload))
        accounts.forEach((account) => bindMethodsAcrossContextBridge(WalletApi.Account.prototype, account))
        return accounts
    },
}

// contextBridge doesn't allow passing custom properties & methods on prototype chain
// https://www.electronjs.org/docs/latest/api/context-bridge
// This workaround exposes the classes through factory methods
// The factory method also copies all the prototype methods to the object so that it gets passed through the bridge
function bindMethodsAcrossContextBridge(prototype, object): void {
    const prototypeProperties = Object.getOwnPropertyNames(prototype)
    prototypeProperties.forEach((key) => {
        if (key !== 'constructor') {
            object[key] = object[key].bind(object)
        }
    })
}

export default ElectronWalletApi
