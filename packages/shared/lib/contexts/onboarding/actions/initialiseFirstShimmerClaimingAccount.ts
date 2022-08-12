import { get } from 'svelte/store'

import { buildEmptyAccountBalance } from '@core/account'
import { localize } from '@core/i18n'
import { profileManager } from '@core/profile-manager'

import { CannotInitialiseShimmerClaimingAccountError, MissingShimmerClaimingProfileManagerError } from '../errors'
import { prepareShimmerClaimingAccount } from '../helpers'
import { shimmerClaimingProfileManager, updateOnboardingProfile } from '../stores'

export async function initialiseFirstShimmerClaimingAccount(): Promise<void> {
    const _shimmerClaimingProfileManager = get(shimmerClaimingProfileManager)
    if (!_shimmerClaimingProfileManager) {
        throw new MissingShimmerClaimingProfileManagerError()
    }

    try {
        const alias = `${localize('general.account')} 1`
        const unboundShimmerClaimingAccount = await _shimmerClaimingProfileManager?.createAccount({ alias })
        const unboundRegularAccount = await get(profileManager)?.createAccount({ alias })
        if (unboundShimmerClaimingAccount?.meta?.index !== unboundRegularAccount?.meta?.index) {
            return
        }

        const emptyAccountBalance = buildEmptyAccountBalance()
        const emptyShimmerClaimingAccount = prepareShimmerClaimingAccount(
            unboundShimmerClaimingAccount,
            emptyAccountBalance,
            unboundRegularAccount?.meta?.publicAddresses[0]?.address
        )
        updateOnboardingProfile({ shimmerClaimingAccounts: [emptyShimmerClaimingAccount] })
    } catch (err) {
        throw new CannotInitialiseShimmerClaimingAccountError()
    }
}
