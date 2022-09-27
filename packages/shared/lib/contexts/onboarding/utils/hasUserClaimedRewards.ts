import { IShimmerClaimingAccount, ShimmerClaimingAccountState } from '@contexts/onboarding'

export function hasUserClaimedRewards(shimmerClaimingAccounts: IShimmerClaimingAccount[]): boolean {
    let hasAtLeastOneClaimingTransaction = false
    const hasClaimedAllRewards = shimmerClaimingAccounts.every((shimmerClaimingAccount) => {
        const { state, claimingTransaction } = shimmerClaimingAccount
        if (state === ShimmerClaimingAccountState.UnclaimedWithoutRewards) {
            return true
        } else if (state === ShimmerClaimingAccountState.FullyClaimed) {
            if (claimingTransaction) {
                /**
                 * NOTE: This side effect is here to avoid iterating more than once in
                 * the case that every account is "unclaimed without rewards".
                 */
                hasAtLeastOneClaimingTransaction = true
            }
            return true
        } else {
            return false
        }
    })
    return hasClaimedAllRewards && hasAtLeastOneClaimingTransaction
}
