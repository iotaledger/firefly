import { get } from 'svelte/store'

import { localize } from '@core/i18n'
import { IAccount } from '@core/account'
import { getWallet, profileManager } from '@core/profile-manager'

import { MissingShimmerClaimingProfileManagerError } from '../errors'
import { prepareShimmerClaimingAccount } from '../helpers'
import { getOnboardingBaseToken, shimmerClaimingProfileManager, updateShimmerClaimingAccount } from '../stores'
import { setTotalUnclaimedShimmerRewards } from '@contexts/onboarding'
import { formatTokenAmountBestMatch } from '@core/wallet/utils'
import { showAppNotification } from '@auxiliary/notification'

export async function syncShimmerClaimingAccount(account: IAccount): Promise<void> {
    const _shimmerClaimingProfileManager = get(shimmerClaimingProfileManager)
    if (!_shimmerClaimingProfileManager) {
        throw new MissingShimmerClaimingProfileManagerError()
    }
    const { index } = account?.getMetadata() ?? {}
    const boundShimmerClaimingAccount = await getWallet(index, shimmerClaimingProfileManager)
    const boundTwinAccount = await getWallet(index, profileManager)

    const syncedShimmerClaimingAccount = await prepareShimmerClaimingAccount(
        boundShimmerClaimingAccount,
        boundTwinAccount,
        true
    )

    if (syncedShimmerClaimingAccount?.unclaimedRewards > 0) {
        const foundRewardsAmount = syncedShimmerClaimingAccount?.unclaimedRewards
        const foundRewardsAmountFormatted = formatTokenAmountBestMatch(foundRewardsAmount, getOnboardingBaseToken())

        showAppNotification({
            type: 'success',
            alert: true,
            message: localize('views.onboarding.shimmerClaiming.success.successfullyFound', {
                values: { amount: foundRewardsAmountFormatted },
            }),
        })
        setTotalUnclaimedShimmerRewards(syncedShimmerClaimingAccount?.unclaimedRewards)
    }

    updateShimmerClaimingAccount(syncedShimmerClaimingAccount)
}
