import { get } from 'svelte/store'

import { Event, InclusionState, TransactionInclusionWalletEvent, WalletEventType } from '@iota/sdk/out/types'

import { localize } from '@core/i18n'
import { MissingTransactionIdError, validateWalletApiEvent } from '@core/wallet'
import { showAppNotification } from '@auxiliary/notification'

import { ShimmerClaimingWalletState } from '../enums'
import { MissingShimmerClaimingAccountError } from '../errors'
import { IShimmerClaimingWallet } from '../interfaces'
import { onboardingProfile, shimmerClaimingTransactions, updateShimmerClaimingAccount } from '../stores'

// TODO(2.0) Fix this

export function handleTransactionInclusionEventForShimmerClaiming(error: Error, rawEvent: Event): void {
    const { walletId, payload } = validateWalletApiEvent(error, rawEvent, WalletEventType.TransactionInclusion)
    const type = payload.type
    if (type === WalletEventType.TransactionInclusion) {
        handleTransactionInclusionEventForShimmerClaimingInternal(walletId, payload as TransactionInclusionWalletEvent)
    }
}

export function handleTransactionInclusionEventForShimmerClaimingInternal(
    accountIndex: number,
    payload: TransactionInclusionWalletEvent
): void {
    const _shimmerClaimingTransactions = get(shimmerClaimingTransactions)
    const profileId = get(onboardingProfile)?.id
    const { transactionId, inclusionState } = payload
    const shimmerClaimingAccount = get(onboardingProfile)?.shimmerClaimingAccounts?.find(
        (_shimmerClaimingAccount) => _shimmerClaimingAccount?.getMetadata()?.index === accountIndex
    )
    if (shimmerClaimingAccount) {
        if (profileId in _shimmerClaimingTransactions && transactionId in _shimmerClaimingTransactions[profileId]) {
            if (inclusionState === InclusionState.Confirmed) {
                updateShimmerClaimingAccount({
                    ...shimmerClaimingAccount,
                    state: ShimmerClaimingWalletState.FullyClaimed,
                })
                showAppNotification({
                    type: 'success',
                    alert: true,
                    message: localize('notifications.claimShimmerRewards.success', {
                        values: { accountAlias: shimmerClaimingAccount?.getMetadata()?.alias },
                    }),
                })
            } else if (inclusionState === InclusionState.Pending) {
                /**
                 * NOTE: If the transaction is still pending, it's
                 * likely we'll eventually receive another event when
                 * it's either a confirmed or conflicting, so we do
                 * nothing here. Optionally we can update the account
                 * with the same information if we need to re-render
                 * a component for some reason.
                 */
            } else {
                handleShimmerClaimingTransactionInclusionEventFailure(shimmerClaimingAccount)
            }
        } else {
            handleShimmerClaimingTransactionInclusionEventFailure(shimmerClaimingAccount, false)
            throw new MissingTransactionIdError()
        }
    } else {
        throw new MissingShimmerClaimingAccountError()
    }
}

function handleShimmerClaimingTransactionInclusionEventFailure(
    shimmerClaimingAccount: IShimmerClaimingWallet,
    displayNotification = true
): void {
    updateShimmerClaimingAccount({
        ...shimmerClaimingAccount,
        state: ShimmerClaimingWalletState.Failed,
    })
    if (displayNotification) {
        showAppNotification({
            type: 'error',
            alert: true,
            message: localize('notifications.claimShimmerRewards.error'),
        })
    }
}
