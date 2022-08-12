import { get } from 'svelte/store'

import { localize } from '@core/i18n'
import { api } from '@core/profile-manager'

import { CannotInitialiseShimmerClaimingAccountError, MissingShimmerClaimingProfileManagerError } from '../errors'
import { prepareShimmerClaimingAccount } from '../helpers'
import { shimmerClaimingProfileManager, updateOnboardingProfile } from '../stores'

export async function initialiseFirstShimmerClaimingAccount(): Promise<void> {
    const _shimmerClaimingProfileManager = get(shimmerClaimingProfileManager)
    if (!_shimmerClaimingProfileManager) {
        throw new MissingShimmerClaimingProfileManagerError()
    }

    try {
        const unboundAccount = await _shimmerClaimingProfileManager?.createAccount({
            alias: `${localize('general.account')} 1`,
        })
        const boundAccount = await api.getAccount(_shimmerClaimingProfileManager?.id, unboundAccount?.meta?.index)
        const balance = await boundAccount?.sync()
        const shimmerClaimingAccount = prepareShimmerClaimingAccount(boundAccount, balance)
        updateOnboardingProfile({ shimmerClaimingAccounts: [shimmerClaimingAccount] })
    } catch (err) {
        throw new CannotInitialiseShimmerClaimingAccountError()
    }
}
