import { get, Writable } from 'svelte/store'

import { CreateAccountPayload } from '@iota/wallet'

import { IAccount } from '@core/account'
import { localize } from '@core/i18n'
import { api, IProfileManager, profileManager } from '@core/profile-manager'
import { sortAccountByIndex, zip } from '@core/utils'

import { ProfileRecoveryType } from '../enums'
import { CannotInitialiseShimmerClaimingAccountError, MissingShimmerClaimingProfileManagerError } from '../errors'
import { prepareShimmerClaimingAccount } from '../helpers'
import { onboardingProfile, shimmerClaimingProfileManager, updateOnboardingProfile } from '../stores'

export async function initialiseFirstShimmerClaimingAccount(): Promise<void> {
    const _shimmerClaimingProfileManager = get(shimmerClaimingProfileManager)
    if (!_shimmerClaimingProfileManager) {
        throw new MissingShimmerClaimingProfileManagerError()
    }

    try {
        const alias = `${localize('general.account')} 1`
        const profileRecoveryType = get(onboardingProfile)?.recoveryType
        if (profileRecoveryType === ProfileRecoveryType.Mnemonic) {
            /**
             * NOTE: We can safely assume that mnemonic-based recoveries
             * will NOT have any accounts, so we create one.
             */
            const shimmerClaimingAccount = await prepareShimmerClaimingAccount(
                await createBoundAccount({ alias }, shimmerClaimingProfileManager),
                await createBoundAccount({ alias }, profileManager)
            )
            updateOnboardingProfile({ shimmerClaimingAccounts: [shimmerClaimingAccount] })
        } else if (profileRecoveryType === ProfileRecoveryType.Stronghold) {
            // TODO: Move to `restoreBackupForShimmerClaimingProfileManager` (also rename?) once copy functionality is in
            await get(profileManager)?.setStrongholdPassword(get(onboardingProfile)?.strongholdPassword)

            const unboundAccounts = await _shimmerClaimingProfileManager?.getAccounts()
            const boundAccounts = (
                await Promise.all(
                    unboundAccounts.map((unboundAccount) =>
                        api?.getAccount(_shimmerClaimingProfileManager?.id, unboundAccount?.meta?.index)
                    )
                )
            ).sort(sortAccountByIndex)
            const boundTwinAccounts = (
                await Promise.all(
                    boundAccounts.map((boundAccount) =>
                        createBoundAccount({ alias: boundAccount?.meta?.alias ?? alias }, profileManager)
                    )
                )
            ).sort(sortAccountByIndex)
            const shimmerClaimingAccounts = (
                await Promise.all(
                    zip<IAccount, IAccount>(boundAccounts, boundTwinAccounts).map(([boundAccount, boundTwinAccount]) =>
                        prepareShimmerClaimingAccount(boundAccount, boundTwinAccount)
                    )
                )
            ).sort(sortAccountByIndex)

            updateOnboardingProfile({ shimmerClaimingAccounts })
        }
    } catch (err) {
        console.error(err)
        throw new CannotInitialiseShimmerClaimingAccountError()
    }
}

async function createBoundAccount(
    payload: CreateAccountPayload,
    manager: Writable<IProfileManager> = profileManager
): Promise<IAccount> {
    const unboundAccount = await get(manager)?.createAccount(payload)
    return api?.getAccount(get(manager)?.id, unboundAccount?.meta?.index)
}
