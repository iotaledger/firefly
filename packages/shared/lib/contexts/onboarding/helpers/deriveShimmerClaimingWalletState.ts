// import { ShimmerClaimingWalletState } from '../enums'

// export function deriveShimmerClaimingWalletState(
//     claimedRewards: number,
//     unclaimedRewards: number
// ): ShimmerClaimingWalletState {
//     /**
//      * NOTE: The "Failed" state is NOT used here; only
//      * when the Shimmer claiming transaction fails, it is
//      * explicitly set then.
//      */
//     if (claimedRewards > 0) {
//         return unclaimedRewards > 0
//             ? ShimmerClaimingWalletState.PartiallyClaimed
//             : ShimmerClaimingWalletState.FullyClaimed
//     } else {
//         return unclaimedRewards > 0
//             ? ShimmerClaimingWalletState.UnclaimedWithRewards
//             : ShimmerClaimingWalletState.UnclaimedWithoutRewards
//     }
// }
