import { ShimmerClaimingAccountState } from '../enums'

export function deriveShimmerClaimingAccountState(
    claimedRewards: number,
    unclaimedRewards: number
): ShimmerClaimingAccountState {
    if (claimedRewards > 0) {
        if (unclaimedRewards > 0) {
            return ShimmerClaimingAccountState.PartiallyClaimed
        } else {
            return ShimmerClaimingAccountState.FullyClaimed
        }
    } else {
        return ShimmerClaimingAccountState.Unclaimed
    }
}
