import type { OutputTypes } from '@iota/types'

import { tryNumberOrZero } from '@core/utils'

import type { IShimmerClaimingAccount } from '../interfaces'

export function sumTotalClaimedRewards(shimmerClaimingAccounts: IShimmerClaimingAccount[]): number {
    return shimmerClaimingAccounts?.reduce(
        (total: number, curr: IShimmerClaimingAccount) =>
            total +
            tryNumberOrZero(
                curr?.claimingTransaction?.payload?.essence?.outputs?.reduce(
                    (outputsTotal: number, currentOutput: OutputTypes) =>
                        outputsTotal + tryNumberOrZero(currentOutput?.amount),
                    0
                )
            ),
        0
    )
}
