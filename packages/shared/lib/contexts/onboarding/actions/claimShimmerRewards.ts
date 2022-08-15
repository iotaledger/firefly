import { get } from 'svelte/store'

import { localize } from '@core/i18n'
import { DEFAULT_TRANSACTION_OPTIONS, getOutputOptions } from '@core/wallet'
import { showAppNotification } from '@lib/notifications'
import { MILLISECONDS_PER_SECOND } from '@lib/time'
import { sleep } from '@lib/utils'

import { prepareShimmerClaimingAccount } from '../helpers'
import { IShimmerClaimingAccount } from '../interfaces'
import { onboardingProfile, updateShimmerClaimingAccounts } from '../stores'

export async function claimShimmerRewards(): Promise<void> {
    try {
        const shimmerClaimingAccounts = get(onboardingProfile)?.shimmerClaimingAccounts
        const unclaimedShimmerClaimingAccounts =
            shimmerClaimingAccounts?.filter((shimmerClaimingAccount) => shimmerClaimingAccount?.unclaimedRewards > 0) ??
            []
        await claimShimmerRewardsForShimmerClaimingAccounts(unclaimedShimmerClaimingAccounts)
        showAppNotification({
            type: 'success',
            message: localize('notifications.shimmerClaiming.success'),
            alert: true,
        })
    } catch (err) {
        console.error(err)
        showAppNotification({
            type: 'error',
            message: localize('notifications.shimmerClaiming.error'),
            alert: true,
        })
    }
}

async function claimShimmerRewardsForShimmerClaimingAccounts(
    shimmerClaimingAccounts: IShimmerClaimingAccount[]
): Promise<void> {
    for (const shimmerClaimingAccount of shimmerClaimingAccounts) {
        await claimShimmerRewardsForShimmerClaimingAccount(shimmerClaimingAccount)
    }
}

async function claimShimmerRewardsForShimmerClaimingAccount(
    shimmerClaimingAccount: IShimmerClaimingAccount
): Promise<void> {
    const recipientAddress = shimmerClaimingAccount?.twinAccount?.meta?.publicAddresses[0]?.address
    const rawAmount = shimmerClaimingAccount?.unclaimedRewards
    const outputOptions = getOutputOptions(null, recipientAddress, rawAmount, '', '')
    const preparedOutput = await shimmerClaimingAccount?.prepareOutput(outputOptions, DEFAULT_TRANSACTION_OPTIONS)
    const claimingTransaction = await shimmerClaimingAccount?.sendOutputs([preparedOutput])

    // TODO: Remove once logic is output-based rather than syncing-based
    await sleep(10 * MILLISECONDS_PER_SECOND)

    const syncedShimmerClaimingAccount = await prepareShimmerClaimingAccount(
        shimmerClaimingAccount,
        shimmerClaimingAccount?.twinAccount,
        true,
        claimingTransaction
    )
    updateShimmerClaimingAccounts(syncedShimmerClaimingAccount)
}
