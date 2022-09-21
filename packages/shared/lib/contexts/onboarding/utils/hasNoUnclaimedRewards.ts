import { IShimmerClaimingAccount, ShimmerClaimingAccountState } from '@contexts/onboarding'

export function hasNoUnclaimedRewards(shimmerClaimingAccounts: IShimmerClaimingAccount[]): boolean {
    return shimmerClaimingAccounts?.every(
        (shimmerClaimingAccount) =>
            shimmerClaimingAccount?.state === ShimmerClaimingAccountState.UnclaimedWithoutRewards
    )
}
