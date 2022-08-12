import { IAccount, IAccountBalance } from '@core/account'

import { ShimmerClaimingAccountState } from '../enums'

export interface IShimmerClaimingAccount extends IAccount {
    balance: IAccountBalance
    claimedRewards: number
    unclaimedRewards: number
    state: ShimmerClaimingAccountState
}
