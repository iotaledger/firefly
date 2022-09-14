import { get } from 'svelte/store'

import { localize } from '@core/i18n'
import { ITransactionInclusionEventPayload, validateWalletApiEvent, WalletApiEvent } from '@core/profile-manager'
import { InclusionState, MissingTransactionIdError } from '@core/wallet'
import { showAppNotification } from '@lib/notifications'

import { ShimmerClaimingAccountState } from '../enums'
import { MissingShimmerClaimingAccountError } from '../errors'
import { onboardingProfile, shimmerClaimingTransactions, updateShimmerClaimingAccount } from '../stores'
import { IShimmerClaimingAccount } from '@contexts/onboarding'

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
    function onError(shimmerClaimingAccount: IShimmerClaimingAccount, displayNotification: boolean = true): void {
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
            } else {
                onError(shimmerClaimingAccount)
            }
        } else {
            onError(shimmerClaimingAccount, false)
            throw new MissingTransactionIdError()
        }
    } else {
        throw new MissingShimmerClaimingAccountError()
    }
}
