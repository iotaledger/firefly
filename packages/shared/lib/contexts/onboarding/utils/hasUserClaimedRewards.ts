import { IShimmerClaimingAccount, ShimmerClaimingAccountState } from '@contexts/onboarding'

export function hasUserClaimedRewards(shimmerClaimingAccounts: IShimmerClaimingAccount[]): boolean {
    return (
        shimmerClaimingAccounts.every((shimmerClaimingAccount) => {
            const { state } = shimmerClaimingAccount
            return (
                state === ShimmerClaimingAccountState.UnclaimedWithoutRewards ||
                state === ShimmerClaimingAccountState.FullyClaimed
            )
        }) &&
        shimmerClaimingAccounts?.some((shimmerClaimingAccount) => Boolean(shimmerClaimingAccount?.claimingTransaction))
    )
}
