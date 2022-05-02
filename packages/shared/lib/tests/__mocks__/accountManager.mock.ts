export class AccountManager {
    getAccount(accountId) {
        return undefined
    }
    getAccounts() {
        return undefined
    }
    createAccount(account) {
        return undefined
    }
    setStrongholdPassword(password) {
        return Promise.resolve(password)
    }
    generateMnemonic() {
        return Promise.resolve('mnemonic')
    }
    storeMnemonic(mnemonic) {
        return Promise.resolve(mnemonic)
    }
    verifyMnemonic(mnemonic) {
        return Promise.resolve(mnemonic)
    }
    backup(destination, password) {
        return Promise.resolve(destination)
    }
    importAccounts(backupPath, password) {
        return Promise.resolve(backupPath)
    }
    listen(eventTypes, callback) {
        return
    }
}
