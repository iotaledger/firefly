import { get } from 'svelte/store'

import { Event, TransactionInclusionWalletEvent } from '@iota/wallet'
import { WalletEventType } from '@iota/wallet/out/types'

import { localize } from '@core/i18n'
import { validateWalletApiEvent } from '@core/profile-manager'
import { InclusionState, MissingTransactionIdError } from '@core/wallet'
import { showAppNotification } from '@auxiliary/notification'

import { ShimmerClaimingAccountState } from '../enums'
import { MissingShimmerClaimingAccountError } from '../errors'
import { IShimmerClaimingAccount } from '../interfaces'
import { onboardingProfile, shimmerClaimingTransactions, updateShimmerClaimingAccount } from '../stores'

export function handleTransactionInclusionEventForShimmerClaiming(error: Error, rawEvent: Event): void {
    const { accountIndex, payload } = validateWalletApiEvent(error, rawEvent, WalletEventType.TransactionInclusion)
    const type = payload.type
    if (type === WalletEventType.TransactionInclusion) {
        handleTransactionInclusionEventForShimmerClaimingInternal(
            accountIndex,
            payload as TransactionInclusionWalletEvent
        )
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
                    state: ShimmerClaimingAccountState.FullyClaimed,
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
    shimmerClaimingAccount: IShimmerClaimingAccount,
    displayNotification = true
): void {
    updateShimmerClaimingAccount({
        ...shimmerClaimingAccount,
        state: ShimmerClaimingAccountState.Failed,
    })
    if (displayNotification) {
        showAppNotification({
            type: 'error',
            alert: true,
            message: localize('notifications.claimShimmerRewards.error'),
        })
    }
}
