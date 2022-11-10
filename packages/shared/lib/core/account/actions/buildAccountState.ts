import { AccountBalance } from '@iota/wallet'

import { getDepositAddress } from '@core/account/utils'

import { IAccount, IAccountMetadata, IAccountState } from '../interfaces'

export async function buildAccountState(account: IAccount, metadata: IAccountMetadata): Promise<IAccountState> {
    let balances: AccountBalance = {
        baseCoin: {
            total: '0',
            available: '0',
        },
        requiredStorageDeposit: '0',
        nativeTokens: [],
        nfts: [],
        foundries: [],
        potentiallyLockedOutputs: {},
        aliases: [],
    }
    let depositAddress: string
    try {
        balances = await account.getBalance()
        depositAddress = await getDepositAddress(account)
    } catch (error) {
        console.error(error)
    }

    return {
        ...account,
        ...metadata,
        depositAddress,
        balances,
        isTransferring: false,
    }
}
