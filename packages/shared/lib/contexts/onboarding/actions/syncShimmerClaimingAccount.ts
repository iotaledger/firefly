// import { get } from 'svelte/store'

// import { localize } from '@core/i18n'

// import { MissingShimmerClaimingProfileManagerError } from '../errors'
// import { prepareShimmerClaimingAccount } from '../helpers'
// import { getOnboardingBaseToken, shimmerClaimingProfileManager, updateShimmerClaimingAccount } from '../stores'
// import { setTotalUnclaimedShimmerRewards } from '@contexts/onboarding'
// import { formatTokenAmountBestMatch } from '@core/wallet/utils'
// import { showAppNotification } from '@auxiliary/notification'
// import { getWallet, IWallet } from '@core/profile'

// // TODO(2.0) Fix
// export async function syncShimmerClaimingAccount(wallet: IWallet): Promise<void> {
//     const _shimmerClaimingProfileManager = get(shimmerClaimingProfileManager)
//     if (!_shimmerClaimingProfileManager) {
//         throw new MissingShimmerClaimingProfileManagerError()
//     }
//     const { index } = wallet?.getMetadata() ?? {} // TODO(2.0) Indexes are gone...
//     const boundShimmerClaimingAccount = await getWallet(index, shimmerClaimingProfileManager) // TODO(2.0) What should we be passing instead?
//     const boundTwinAccount = await getWallet(index, profileManager)

//     const syncedShimmerClaimingAccount = await prepareShimmerClaimingAccount(
//         boundShimmerClaimingAccount,
//         boundTwinAccount,
//         true
//     )

//     if (syncedShimmerClaimingAccount?.unclaimedRewards > 0) {
//         const foundRewardsAmount = syncedShimmerClaimingAccount?.unclaimedRewards
//         const foundRewardsAmountFormatted = formatTokenAmountBestMatch(foundRewardsAmount, getOnboardingBaseToken())

//         showAppNotification({
//             type: 'success',
//             alert: true,
//             message: localize('views.onboarding.shimmerClaiming.success.successfullyFound', {
//                 values: { amount: foundRewardsAmountFormatted },
//             }),
//         })
//         setTotalUnclaimedShimmerRewards(syncedShimmerClaimingAccount?.unclaimedRewards)
//     }

//     updateShimmerClaimingAccount(syncedShimmerClaimingAccount)
// }
