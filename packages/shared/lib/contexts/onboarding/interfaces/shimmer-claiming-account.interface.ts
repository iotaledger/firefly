import { Transaction } from '@iota/sdk/out/types'
import { IWallet } from '@core/profile'

import { ShimmerClaimingWalletState } from '../enums'

export interface IShimmerClaimingWallet extends IWallet {
    twinAccount: IWallet
    state: ShimmerClaimingWalletState
    claimedRewards: number
    unclaimedRewards: number
    claimingTransaction?: Transaction
}
