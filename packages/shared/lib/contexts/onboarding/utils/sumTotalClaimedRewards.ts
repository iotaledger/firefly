import { tryNumberOrZero } from '@core/utils'

import { IShimmerClaimingAccount } from '../interfaces'
import { Output, RegularTransactionEssence } from '@iota/wallet'

export function sumTotalClaimedRewards(shimmerClaimingAccounts: IShimmerClaimingAccount[]): number {
    return shimmerClaimingAccounts?.reduce(
        (total: number, curr: IShimmerClaimingAccount) =>
            total +
            tryNumberOrZero(
                (curr?.claimingTransaction?.payload?.essence as RegularTransactionEssence).outputs?.reduce(
                    (outputsTotal: number, currentOutput: Output) =>
                        outputsTotal + tryNumberOrZero(currentOutput?.getAmount()),
                    0
                )
            ),
        0
    )
}
