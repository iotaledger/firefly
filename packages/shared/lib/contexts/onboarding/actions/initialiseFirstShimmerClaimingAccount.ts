import { get } from 'svelte/store'

import { createBoundAccount, IAccount } from '@core/account'
import { localize } from '@core/i18n'
import { api, profileManager } from '@core/profile-manager'
import { sortAccountsByIndex, zip } from '@core/utils'

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
        if (
            profileRecoveryType === ProfileRecoveryType.Mnemonic ||
            profileRecoveryType === ProfileRecoveryType.Ledger
        ) {
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
            const unboundAccounts = await _shimmerClaimingProfileManager?.getAccounts()
            if (unboundAccounts?.length === 0) {
                const unboundAccount = await _shimmerClaimingProfileManager?.createAccount({ alias })
                unboundAccounts.push(unboundAccount)
            }
            const boundAccounts = (
                await Promise.all(
                    unboundAccounts.map((unboundAccount) =>
                        api?.getAccount(_shimmerClaimingProfileManager?.id, unboundAccount?.meta?.index)
                    )
                )
            ).sort(sortAccountsByIndex)
            const boundTwinAccounts = (
                await Promise.all(
                    boundAccounts.map((boundAccount) =>
                        createBoundAccount({ alias: boundAccount?.meta?.alias ?? alias }, profileManager)
                    )
                )
            ).sort(sortAccountsByIndex)
            const shimmerClaimingAccounts = (
                await Promise.all(
                    zip<IAccount, IAccount>(boundAccounts, boundTwinAccounts).map(([boundAccount, boundTwinAccount]) =>
                        prepareShimmerClaimingAccount(boundAccount, boundTwinAccount)
                    )
                )
            ).sort(sortAccountsByIndex)

            updateOnboardingProfile({ shimmerClaimingAccounts })
        }
    } catch (err) {
        console.error(err)
        throw new CannotInitialiseShimmerClaimingAccountError()
    }
}
