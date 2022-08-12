import { get } from 'svelte/store'

import { localize } from '@core/i18n'
import { DEFAULT_TRANSACTION_OPTIONS, getOutputOptions } from '@core/wallet'
import { showAppNotification } from '@lib/notifications'

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
    } catch (err) {
        console.error(err)
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
    await shimmerClaimingAccount?.sendOutputs([preparedOutput])

    const syncedShimmerClaimingAccount = await prepareShimmerClaimingAccount(
        shimmerClaimingAccount,
        shimmerClaimingAccount?.twinAccount
    )
    updateShimmerClaimingAccounts(syncedShimmerClaimingAccount)

    showAppNotification({
        type: 'success',
        message: localize('notifications.shimmerClaiming.success'),
        alert: true,
    })
}
