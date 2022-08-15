import { IShimmerClaimingAccount } from '../interfaces'

export function sumTotalClaimedRewards(shimmerClaimingAccounts: IShimmerClaimingAccount[]): number {
    let total = 0

    shimmerClaimingAccounts?.forEach((shimmerClaimingAccount) => {
        shimmerClaimingAccount?.claimingTransaction?.payload?.essence?.outputs?.forEach((output) => {
            total += Number(output?.amount) ?? 0
        })
    })

    return total
}
