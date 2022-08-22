import { get } from 'svelte/store'

import { IAccount } from '@core/account'
import { api, profileManager } from '@core/profile-manager'

import { MissingShimmerClaimingProfileManagerError } from '../errors'
import { prepareShimmerClaimingAccount } from '../helpers'
import { shimmerClaimingProfileManager, updateShimmerClaimingAccount } from '../stores'
import { setTotalUnclaimedShimmerRewards } from '@contexts/onboarding'
import { formatTokenAmountBestMatch } from '@core/wallet'
import { BASE_TOKEN, NetworkProtocol } from '@core/network'
import { showAppNotification } from '@lib/notifications'

export async function findShimmerRewardsForAccount(account: IAccount): Promise<void> {
    const _shimmerClaimingProfileManager = get(shimmerClaimingProfileManager)
    if (!_shimmerClaimingProfileManager) {
        throw new MissingShimmerClaimingProfileManagerError()
    }
    const boundShimmerClaimingAccount = await api.getAccount(_shimmerClaimingProfileManager?.id, account?.meta?.index)
    const boundTwinAccount = await api.getAccount(get(profileManager)?.id, account?.meta?.index)
    if (boundShimmerClaimingAccount?.meta?.index !== boundTwinAccount?.meta?.index) {
        return
    }

    const syncedShimmerClaimingAccount = await prepareShimmerClaimingAccount(
        boundShimmerClaimingAccount,
        boundTwinAccount,
        true
    )

    if (syncedShimmerClaimingAccount?.unclaimedRewards > 0) {
        const foundRewardsAmount = syncedShimmerClaimingAccount?.unclaimedRewards
        const foundRewardsAmountFormatted = formatTokenAmountBestMatch(
            foundRewardsAmount,
            BASE_TOKEN[NetworkProtocol.Shimmer]
        )

        showAppNotification({
            type: 'success',
            alert: true,
            message: `Successfully found ${foundRewardsAmountFormatted}`,
        })
        setTotalUnclaimedShimmerRewards(syncedShimmerClaimingAccount?.unclaimedRewards)
    }

    updateShimmerClaimingAccount(syncedShimmerClaimingAccount)
}
