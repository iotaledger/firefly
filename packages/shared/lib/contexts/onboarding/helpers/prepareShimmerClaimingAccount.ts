import { IAccount, IAccountBalance } from '@core/account'

import { ShimmerClaimingAccountState } from '../enums'
import { IShimmerClaimingAccount } from '../interfaces'

export function prepareShimmerClaimingAccount(account: IAccount, balance: IAccountBalance): IShimmerClaimingAccount {
    const claimedRewards = 0
    const unclaimedRewards = Number(balance?.baseCoin?.available)
    const state = ShimmerClaimingAccountState.Unclaimed

    return {
        ...account,
        balance,
        claimedRewards,
        unclaimedRewards,
        state,
    }
}
