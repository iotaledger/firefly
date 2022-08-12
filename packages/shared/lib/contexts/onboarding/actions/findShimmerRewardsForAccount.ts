import { get } from 'svelte/store'

import { IAccount } from '@core/account'
import { api } from '@core/profile-manager'

import { MissingShimmerClaimingProfileManagerError } from '../errors'
import { prepareShimmerClaimingAccount } from '../helpers'
import { onboardingProfile, shimmerClaimingProfileManager, updateOnboardingProfile } from '../stores'

export async function findShimmerRewardsForAccount(account: IAccount): Promise<void> {
    const _shimmerClaimingProfileManager = get(shimmerClaimingProfileManager)
    if (!_shimmerClaimingProfileManager) {
        throw new MissingShimmerClaimingProfileManagerError()
    }
    const boundAccount = await api.getAccount(_shimmerClaimingProfileManager?.id, account?.meta?.index)
    const syncedBalance = await boundAccount?.sync()
    const syncedShimmerClaimingAccount = prepareShimmerClaimingAccount(boundAccount, syncedBalance)

    const _onboardingProfile = get(onboardingProfile)
    const isNewShimmerClaimingAccount = !_onboardingProfile?.shimmerClaimingAccounts.some(
        (shimmerClaimingAccount) => shimmerClaimingAccount?.meta?.index === account?.meta?.index
    )
    const shimmerClaimingAccounts = isNewShimmerClaimingAccount
        ? [..._onboardingProfile?.shimmerClaimingAccounts, syncedShimmerClaimingAccount]
        : _onboardingProfile?.shimmerClaimingAccounts?.map((shimmerClaimingAccount) =>
              shimmerClaimingAccount?.meta?.index === account?.meta?.index
                  ? syncedShimmerClaimingAccount
                  : shimmerClaimingAccount
          )
    updateOnboardingProfile({ shimmerClaimingAccounts })
}
