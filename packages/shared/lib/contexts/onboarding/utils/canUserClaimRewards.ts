import { IShimmerClaimingAccount, ShimmerClaimingAccountState } from '@contexts/onboarding'

export function canUserClaimRewards(shimmerClaimingAccounts: IShimmerClaimingAccount[]): boolean {
    return shimmerClaimingAccounts?.some((shimmerClaimingAccount) => {
        const { state } = shimmerClaimingAccount
        return (
            state === ShimmerClaimingAccountState.UnclaimedWithRewards ||
            state === ShimmerClaimingAccountState.PartiallyClaimed ||
            state === ShimmerClaimingAccountState.Failed
        )
    })
}
