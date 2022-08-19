import { get } from 'svelte/store'

import { IAccount } from '@core/account'
import { api, profileManager } from '@core/profile-manager'

import { MissingShimmerClaimingProfileManagerError } from '../errors'
import { prepareShimmerClaimingAccount } from '../helpers'
import { shimmerClaimingProfileManager, updateShimmerClaimingAccount } from '../stores'

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
    updateShimmerClaimingAccount(syncedShimmerClaimingAccount)
}
