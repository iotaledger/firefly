import { IAccount } from '@core/account'
import { handleLedgerError } from '@core/ledger/utils'
import { createWallet, getWallets, profileManager } from '@core/profile-manager'
import { sortAccountsByIndex, zip } from '@core/utils'
import { get } from 'svelte/store'
import { RestoreProfileType } from '../enums'
import { CannotInitialiseShimmerClaimingAccountError, MissingShimmerClaimingProfileManagerError } from '../errors'
import { prepareShimmerClaimingAccount } from '../helpers'
import {
    isOnboardingLedgerProfile,
    onboardingProfile,
    shimmerClaimingProfileManager,
    updateOnboardingProfile,
} from '../stores'

export async function initialiseFirstShimmerClaimingAccount(): Promise<void> {
    if (!get(shimmerClaimingProfileManager)) {
        throw new MissingShimmerClaimingProfileManagerError()
    }

    try {
        const restoreProfileType = get(onboardingProfile)?.restoreProfileType
        if (restoreProfileType === RestoreProfileType.Mnemonic || restoreProfileType === RestoreProfileType.Ledger) {
            /**
             * NOTE: We can safely assume that mnemonic- and Ledger-based recoveries
             * will NOT have any accounts, so we create one.
             */
            const shimmerClaimingAccount = await prepareShimmerClaimingAccount(
                await createWallet({}, shimmerClaimingProfileManager),
                await createWallet({}, profileManager)
            )
            updateOnboardingProfile({ shimmerClaimingAccounts: [shimmerClaimingAccount] })
        } else if (restoreProfileType === RestoreProfileType.Stronghold) {
            const accounts = await getWallets(shimmerClaimingProfileManager)
            if (accounts?.length === 0) {
                const account = await createWallet({}, shimmerClaimingProfileManager)
                accounts.push(account)
            }
            accounts.sort(sortAccountsByIndex)

            const twinAccounts = (
                await Promise.all(
                    accounts.map((boundAccount) =>
                        createWallet({ alias: boundAccount?.getMetadata()?.alias }, profileManager)
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
        console.error(err)
        if (get(isOnboardingLedgerProfile)) {
            handleLedgerError(err?.error ?? err)
        }
        throw new CannotInitialiseShimmerClaimingAccountError()
    }
}
