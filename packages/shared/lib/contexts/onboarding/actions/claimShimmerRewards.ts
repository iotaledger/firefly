import { get } from 'svelte/store'

import { localize } from '@core/i18n'
import { BASE_TOKEN, COIN_TYPE, NetworkProtocol } from '@core/network'
import {
    DEFAULT_TRANSACTION_OPTIONS,
    formatTokenAmountBestMatch,
    getAssetFromPersistedAssets,
    getOutputOptions,
    resetNewTransactionDetails,
    setNewTransactionDetails,
    validateSendConfirmation,
} from '@core/wallet'
import { showAppNotification } from '@lib/notifications'
import type { Transaction } from '@iota/wallet'

import { ShimmerClaimingAccountState } from '../enums'
import { IShimmerClaimingAccount } from '../interfaces'
import {
    isOnboardingLedgerProfile,
    onboardingProfile,
    persistShimmerClaimingTransaction,
    updateShimmerClaimingAccount,
} from '../stores'
import { handleLedgerError } from '@core/ledger'

export async function claimShimmerRewards(): Promise<void> {
    const shimmerClaimingAccounts = get(onboardingProfile)?.shimmerClaimingAccounts
    const unclaimedShimmerClaimingAccounts =
        shimmerClaimingAccounts?.filter((shimmerClaimingAccount) => shimmerClaimingAccount?.unclaimedRewards > 0) ?? []
    await claimShimmerRewardsForShimmerClaimingAccounts(unclaimedShimmerClaimingAccounts)
}

async function claimShimmerRewardsForShimmerClaimingAccounts(
    shimmerClaimingAccounts: IShimmerClaimingAccount[]
): Promise<void> {
    for (const shimmerClaimingAccount of shimmerClaimingAccounts) {
        try {
            updateShimmerClaimingAccount({
                ...shimmerClaimingAccount,
                state: ShimmerClaimingAccountState.Claiming,
            })
            await claimShimmerRewardsForShimmerClaimingAccount(shimmerClaimingAccount)
        } catch (err) {
            updateShimmerClaimingAccount({
                ...shimmerClaimingAccount,
                state: ShimmerClaimingAccountState.Failed,
            })
            if (get(isOnboardingLedgerProfile)) {
                handleLedgerError(err?.error ?? err)
            } else {
                showAppNotification({
                    type: 'error',
                    alert: true,
                    message: localize('notifications.claimShimmerRewards.error'),
                })
            }
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
    validateSendConfirmation(outputOptions, preparedOutput)

    let claimingTransaction: Transaction
    if (get(isOnboardingLedgerProfile)) {
        const shimmerTokenMetadata = BASE_TOKEN[NetworkProtocol.Shimmer]
        setNewTransactionDetails({
            asset: {
                ...getAssetFromPersistedAssets(COIN_TYPE[NetworkProtocol.Shimmer].toString()),
                balance: {
                    total: rawAmount,
                },
            },
            amount: formatTokenAmountBestMatch(rawAmount, shimmerTokenMetadata),
            unit: '',
            recipient: {
                type: 'address',
                address: recipientAddress,
            },
            metadata: '',
            tag: '',
        })
        claimingTransaction = await shimmerClaimingAccount?.sendOutputs([preparedOutput])
        resetNewTransactionDetails()
    } else {
        claimingTransaction = await shimmerClaimingAccount?.sendOutputs([preparedOutput])
    }
    persistShimmerClaimingTransaction(claimingTransaction?.transactionId)
}
