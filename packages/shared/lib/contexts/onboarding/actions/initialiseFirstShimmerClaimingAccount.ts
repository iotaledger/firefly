import { get } from 'svelte/store'

import { localize } from '@core/i18n'
import { api, profileManager } from '@core/profile-manager'

import { CannotInitialiseShimmerClaimingAccountError, MissingShimmerClaimingProfileManagerError } from '../errors'
import { prepareShimmerClaimingAccount } from '../helpers'
import { onboardingProfile, shimmerClaimingProfileManager, updateOnboardingProfile } from '../stores'

export async function initialiseFirstShimmerClaimingAccount(): Promise<void> {
    const _shimmerClaimingProfileManager = get(shimmerClaimingProfileManager)
    if (!_shimmerClaimingProfileManager) {
        throw new MissingShimmerClaimingProfileManagerError()
    }

    try {
        // TODO: CHANGE LOGIC BASED ON RECOVERY TYPE (mnemonic always needs to create, Stronghold should only create however many were recovered)

        const alias = `${localize('general.account')} 1`
        const accounts = await _shimmerClaimingProfileManager?.getAccounts()
        if (accounts?.length === 0) {
            const unboundShimmerClaimingAccount = await _shimmerClaimingProfileManager?.createAccount({ alias })
            const boundShimmerClaimingAccount = await api?.getAccount(
                _shimmerClaimingProfileManager?.id,
                unboundShimmerClaimingAccount?.meta?.index
            )
            const unboundTwinAccount = await get(profileManager)?.createAccount({ alias })
            const boundTwinAccount = await api?.getAccount(get(profileManager)?.id, unboundTwinAccount?.meta?.index)
            if (boundShimmerClaimingAccount?.meta?.index !== boundTwinAccount?.meta?.index) {
                return
            }

            const shimmerClaimingAccount = await prepareShimmerClaimingAccount(
                boundShimmerClaimingAccount,
                boundTwinAccount
            )
            updateOnboardingProfile({ shimmerClaimingAccounts: [shimmerClaimingAccount] })
        } else {
            const boundShimmerClaimingAccount = await api?.getAccount(_shimmerClaimingProfileManager?.id, 0)
            await get(profileManager)?.setStrongholdPassword(get(onboardingProfile)?.strongholdPassword)
            await get(profileManager)?.createAccount({ alias: boundShimmerClaimingAccount?.meta?.alias ?? alias })
            const boundTwinAccount = await api?.getAccount(get(profileManager)?.id, 0)
            const shimmerClaimingAccount = await prepareShimmerClaimingAccount(
                boundShimmerClaimingAccount,
                boundTwinAccount,
                true
            )
            updateOnboardingProfile({ shimmerClaimingAccounts: [shimmerClaimingAccount] })
        }
    } catch (err) {
        console.error(err)
        throw new CannotInitialiseShimmerClaimingAccountError()
    }
}
