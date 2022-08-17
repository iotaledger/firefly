import { IShimmerClaimingAccount } from '../interfaces'
import { OutputTypes } from '@iota/types'

export function sumTotalClaimedRewards(shimmerClaimingAccounts: IShimmerClaimingAccount[]): number {
    return shimmerClaimingAccounts?.reduce(
        (total: number, curr: IShimmerClaimingAccount) =>
            total +
            curr?.claimingTransaction?.payload?.essence?.outputs?.reduce(
                (outputsTotal: number, currentOutput: OutputTypes) => outputsTotal + Number(currentOutput?.amount) ?? 0,
                0
            ),
        0
    )
}
