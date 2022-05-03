import type { AccountId, CreateAccountPayload } from '@iota/wallet'
import { ProfileManager, StardustAccount } from '../../typings/profile'
import { AccountMock } from './account.mock'

export const MOCK_MNEMONIC =
    'term aisle loyal cradle talent buddy crater express asthma load antique game better head position master aspect print more wine sword speed joy story'

export class ProfileManagerMock implements ProfileManager {
    getAccount(accountId: AccountId) {
        return undefined
    }

    getAccounts() {
        return undefined
    }

    createAccount(account: CreateAccountPayload): Promise<StardustAccount> {
        return Promise.resolve(new AccountMock())
    }

    setStrongholdPassword(password: string): Promise<string> {
        return Promise.resolve(password)
    }

    generateMnemonic(): Promise<string> {
        return Promise.resolve(MOCK_MNEMONIC)
    }

    storeMnemonic(mnemonic: string): Promise<string> {
        return Promise.resolve(mnemonic)
    }

    verifyMnemonic(mnemonic: string): Promise<string> {
        return Promise.resolve(mnemonic)
    }

    backup(_: string, __: string): Promise<void> {
        return Promise.resolve()
    }

    importAccounts(backupPath: string, _: string): Promise<string> {
        return Promise.resolve(backupPath)
    }

    listen(eventTypes, callback) {
        return
    }
}
