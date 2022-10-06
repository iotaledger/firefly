import { IShimmerClaimingAccount, ShimmerClaimingAccountState } from '@contexts/onboarding'

export function canUserRecoverFromShimmerClaiming(shimmerClaimingAccounts: IShimmerClaimingAccount[]): boolean {
    return shimmerClaimingAccounts?.every((shimmerClaimingAccount) => {
        const { state } = shimmerClaimingAccount
        return (
            state === ShimmerClaimingAccountState.UnclaimedWithoutRewards ||
            state === ShimmerClaimingAccountState.FullyClaimed
        )
    })
}
