import { ProfileManager } from '../../typings/profile'

export const MOCK_MNEMONIC =
    'term aisle loyal cradle talent buddy crater express asthma load antique game better head position master aspect print more wine sword speed joy story'

export class ProfileManagerMock implements ProfileManager {
    getAccount(accountId) {
        return undefined
    }

    getAccounts() {
        return undefined
    }

    createAccount(account) {
        return undefined
    }

    setStrongholdPassword(password: string): Promise<string> {
        return Promise.resolve(password)
    }

    generateMnemonic(): Promise<string> {
        return Promise.resolve(MOCK_MNEMONIC)
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
