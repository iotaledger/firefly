import { tryNumberOrZero } from '@core/utils'

import { IShimmerClaimingWallet } from '../interfaces'
import { Output, RegularTransactionEssence } from '@iota/sdk/out/types'

export function sumTotalClaimedRewards(shimmerClaimingAccounts: IShimmerClaimingWallet[]): number {
    return shimmerClaimingAccounts?.reduce(
        (total: number, curr: IShimmerClaimingWallet) =>
            total +
            tryNumberOrZero(
                (curr?.claimingTransaction?.payload?.essence as RegularTransactionEssence).outputs?.reduce(
                    (outputsTotal: number, currentOutput: Output) =>
                        outputsTotal + tryNumberOrZero(currentOutput?.amount),
                    0
                )
            ),
        0
    )
}
