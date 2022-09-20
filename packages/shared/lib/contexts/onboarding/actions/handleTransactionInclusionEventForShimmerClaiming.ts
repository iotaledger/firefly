import { get } from 'svelte/store'

import { localize } from '@core/i18n'
import { ITransactionInclusionEventPayload, validateWalletApiEvent, WalletApiEvent } from '@core/profile-manager'
import { InclusionState, MissingTransactionIdError } from '@core/wallet'
import { showAppNotification } from '@lib/notifications'

import { ShimmerClaimingAccountState } from '../enums'
import { MissingShimmerClaimingAccountError } from '../errors'
import { IShimmerClaimingAccount } from '../interfaces'
import { onboardingProfile, shimmerClaimingTransactions, updateShimmerClaimingAccount } from '../stores'

export function handleTransactionInclusionEventForShimmerClaiming(error: Error, rawEvent: string): void {
    const { accountIndex, payload } = validateWalletApiEvent(error, rawEvent, WalletApiEvent.TransactionInclusion)
    /* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
    handleTransactionInclusionEventForShimmerClaimingInternal(
        accountIndex,
        payload as ITransactionInclusionEventPayload
    )
}

export function handleTransactionInclusionEventForShimmerClaimingInternal(
    accountIndex: number,
    payload: ITransactionInclusionEventPayload
): void {
    const _shimmerClaimingTransactions = get(shimmerClaimingTransactions)
    const profileId = get(onboardingProfile)?.id
    const { transactionId, inclusionState } = payload
    const shimmerClaimingAccount = get(onboardingProfile)?.shimmerClaimingAccounts?.find(
        (_shimmerClaimingAccount) => _shimmerClaimingAccount?.meta?.index === accountIndex
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
                        values: { accountAlias: shimmerClaimingAccount?.meta?.alias },
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
