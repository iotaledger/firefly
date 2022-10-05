import { get } from 'svelte/store'

import { IAccount } from '@core/account'
import { localize } from '@core/i18n'
import { profileManager, createAccount, getAccounts } from '@core/profile-manager'
import { sortAccountsByIndex, zip } from '@core/utils'

import { ProfileRecoveryType } from '../enums'
import { CannotInitialiseShimmerClaimingAccountError, MissingShimmerClaimingProfileManagerError } from '../errors'
import { prepareShimmerClaimingAccount } from '../helpers'
import {
    isOnboardingLedgerProfile,
    onboardingProfile,
    shimmerClaimingProfileManager,
    updateOnboardingProfile,
} from '../stores'
import { handleLedgerError } from '@core/ledger'

export async function initialiseFirstShimmerClaimingAccount(): Promise<void> {
    if (!get(shimmerClaimingProfileManager)) {
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
             * NOTE: We can safely assume that mnemonic- and Ledger-based recoveries
             * will NOT have any accounts, so we create one.
             */
            const shimmerClaimingAccount = await prepareShimmerClaimingAccount(
                await createAccount({ alias }, shimmerClaimingProfileManager),
                await createAccount({ alias }, profileManager)
            )
            updateOnboardingProfile({ shimmerClaimingAccounts: [shimmerClaimingAccount] })
        } else if (profileRecoveryType === ProfileRecoveryType.Stronghold) {
            const accounts = await getAccounts(shimmerClaimingProfileManager)
            if (accounts?.length === 0) {
                const account = await createAccount({ alias }, shimmerClaimingProfileManager)
                accounts.push(account)
            }
            accounts.sort(sortAccountsByIndex)

            const twinAccounts = (
                await Promise.all(
                    accounts.map((boundAccount) =>
                        createAccount({ alias: boundAccount?.getMetadata()?.alias ?? alias }, profileManager)
                    )
                )
            ).sort(sortAccountsByIndex)
            const shimmerClaimingAccounts = (
                await Promise.all(
                    zip<IAccount, IAccount>(accounts, twinAccounts).map(([account, twinAccount]) =>
                        prepareShimmerClaimingAccount(account, twinAccount)
                    )
                )
            ).sort(sortAccountsByIndex)

            updateOnboardingProfile({ shimmerClaimingAccounts })
        }
    } catch (err) {
        if (get(isOnboardingLedgerProfile)) {
            handleLedgerError(err?.error ?? err)
        }
        console.error(err)
        throw new CannotInitialiseShimmerClaimingAccountError()
    }
}
