import { tryNumberOrZero } from '@core/utils'

import { IShimmerClaimingAccount } from '../interfaces'
import { Output, RegularTransactionEssence } from '@iota/wallet/out/types'

export function sumTotalClaimedRewards(shimmerClaimingAccounts: IShimmerClaimingAccount[]): number {
    return shimmerClaimingAccounts?.reduce(
        (total: number, curr: IShimmerClaimingAccount) =>
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
