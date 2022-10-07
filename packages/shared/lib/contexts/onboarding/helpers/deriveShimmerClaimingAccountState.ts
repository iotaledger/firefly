import { ShimmerClaimingAccountState } from '../enums'

export function deriveShimmerClaimingAccountState(
    claimedRewards: number,
    unclaimedRewards: number
): ShimmerClaimingAccountState {
    /**
     * NOTE: The "Failed" state is NOT used here; only
     * when the Shimmer claiming transaction fails, it is
     * explicitly set then.
     */
    if (claimedRewards > 0) {
        return unclaimedRewards > 0
            ? ShimmerClaimingAccountState.PartiallyClaimed
            : ShimmerClaimingAccountState.FullyClaimed
    } else {
        return unclaimedRewards > 0
            ? ShimmerClaimingAccountState.UnclaimedWithRewards
            : ShimmerClaimingAccountState.UnclaimedWithoutRewards
    }
}
