import { get } from 'svelte/store'

import { buildEmptyAccountBalance } from '@core/account'
import { localize } from '@core/i18n'

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

        const emptyAccountBalance = buildEmptyAccountBalance()
        const emptyShimmerClaimingAccount = prepareShimmerClaimingAccount(unboundAccount, emptyAccountBalance)
        updateOnboardingProfile({ shimmerClaimingAccounts: [emptyShimmerClaimingAccount] })
    } catch (err) {
        throw new CannotInitialiseShimmerClaimingAccountError()
    }
}
