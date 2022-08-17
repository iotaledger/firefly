import { get } from 'svelte/store'

import { localize } from '@core/i18n'
import { SECONDS_PER_MILESTONE } from '@core/network'
import { DEFAULT_TRANSACTION_OPTIONS, getOutputOptions } from '@core/wallet'
import { showAppNotification } from '@lib/notifications'
import { MILLISECONDS_PER_SECOND } from '@lib/time'
import { sleep } from '@lib/utils'

import { ShimmerClaimingAccountState } from '../enums'
import { prepareShimmerClaimingAccount } from '../helpers'
import { IShimmerClaimingAccount } from '../interfaces'
import { onboardingProfile, updateShimmerClaimingAccounts } from '../stores'

export async function claimShimmerRewards(): Promise<void> {
    const shimmerClaimingAccounts = get(onboardingProfile)?.shimmerClaimingAccounts
    const unclaimedShimmerClaimingAccounts =
        shimmerClaimingAccounts?.filter((shimmerClaimingAccount) => shimmerClaimingAccount?.unclaimedRewards > 0) ?? []
    await claimShimmerRewardsForShimmerClaimingAccounts(unclaimedShimmerClaimingAccounts)

    const processedShimmerClaimingAccounts = get(onboardingProfile)?.shimmerClaimingAccounts
    const shouldShowSuccessNotification = !processedShimmerClaimingAccounts?.some(
        (processedShimmerClaimingAccount) =>
            processedShimmerClaimingAccount?.state === ShimmerClaimingAccountState.Failed
    )
    if (shouldShowSuccessNotification) {
        showAppNotification({
            type: 'success',
            alert: true,
            message: localize('notifications.claimShimmerRewards.success'),
        })
    }
}

async function claimShimmerRewardsForShimmerClaimingAccounts(
    shimmerClaimingAccounts: IShimmerClaimingAccount[]
): Promise<void> {
    for (const shimmerClaimingAccount of shimmerClaimingAccounts) {
        try {
            await claimShimmerRewardsForShimmerClaimingAccount(shimmerClaimingAccount)
        } catch (err) {
            const failedShimmerClaimingAccount = await prepareShimmerClaimingAccount(
                shimmerClaimingAccount,
                shimmerClaimingAccount?.twinAccount,
                false,
                ShimmerClaimingAccountState.Failed
            )
            updateShimmerClaimingAccounts(failedShimmerClaimingAccount)
            showAppNotification({
                type: 'error',
                alert: true,
                message: localize('notifications.claimShimmerRewards.error'),
            })
        }
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

    // TODO: https://github.com/iotaledger/firefly/issues/4223
    await sleep(SECONDS_PER_MILESTONE * MILLISECONDS_PER_SECOND)

    const syncedShimmerClaimingAccount = await prepareShimmerClaimingAccount(
        shimmerClaimingAccount,
        shimmerClaimingAccount?.twinAccount,
        true,
        null,
        claimingTransaction
    )
    updateShimmerClaimingAccounts(syncedShimmerClaimingAccount)
}
