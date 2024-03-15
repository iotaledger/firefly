import { get, Writable } from 'svelte/store'

import { MissingTransactionIdError } from '@core/wallet'
import { persistent } from '@core/utils/store'

import { IShimmerClaimingTransactionStore } from '../interfaces'

import { onboardingProfile } from './onboarding-profile.store'

export const shimmerClaimingTransactions: Writable<IShimmerClaimingTransactionStore> = persistent(
    'shimmerClaimingTransactions',
    {}
)

export function isShimmerClaimingTransaction(transactionId: string, profileId: string | undefined | null): boolean {
    const _shimmerClaimingTransactions = get(shimmerClaimingTransactions)
    profileId = profileId ? profileId : get(onboardingProfile)?.id
    return !!_shimmerClaimingTransactions?.[profileId]?.[transactionId]
}

export function persistShimmerClaimingTransaction(transactionId: string, profileId?: string): void {
    if (!transactionId) {
        throw new MissingTransactionIdError()
    }

    profileId = profileId ? profileId : get(onboardingProfile)?.id
    shimmerClaimingTransactions.update((_shimmerClaimingTransactions) => {
        if (profileId in _shimmerClaimingTransactions) {
            _shimmerClaimingTransactions[profileId][transactionId] = true
        } else {
            _shimmerClaimingTransactions[profileId] = { [transactionId]: true }
        }
        return _shimmerClaimingTransactions
    })
}

export function removePersistedShimmerClaimingTransactions(profileId?: string): void {
    profileId = profileId ? profileId : get(onboardingProfile)?.id
    const _shimmerClaimingTransactions = get(shimmerClaimingTransactions)
    delete _shimmerClaimingTransactions[profileId]
    shimmerClaimingTransactions.set(_shimmerClaimingTransactions)
}
