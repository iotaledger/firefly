import { IAccount } from '@core/account'
import * as api from '@core/api/actions'
import { WalletOptions } from '@iota/sdk/out/types'

export function createAccount(id: string, walletOptions: WalletOptions): Promise<IAccount> {
    // TODO(2.0): Add all necessary wallet options here
    return api.createAccount(id, walletOptions)
}
