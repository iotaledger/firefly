import { IAccount, IAccountBalance } from '@core/account'

import { ShimmerClaimingAccountState } from '../enums'

export interface IShimmerClaimingAccount extends IAccount {
    balance: IAccountBalance
    state: ShimmerClaimingAccountState
    claimedRewards: number
    unclaimedRewards: number
    claimDepositAddress: string
}
