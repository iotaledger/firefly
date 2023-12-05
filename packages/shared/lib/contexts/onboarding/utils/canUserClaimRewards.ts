import { IShimmerClaimingWallet, ShimmerClaimingWalletState } from '@contexts/onboarding'

export function canUserClaimRewards(shimmerClaimingAccounts: IShimmerClaimingWallet[]): boolean {
    return shimmerClaimingAccounts?.some((shimmerClaimingAccount) => {
        const { state } = shimmerClaimingAccount
        return (
            state === ShimmerClaimingWalletState.UnclaimedWithRewards ||
            state === ShimmerClaimingWalletState.PartiallyClaimed ||
            state === ShimmerClaimingWalletState.Failed
        )
    })
}
