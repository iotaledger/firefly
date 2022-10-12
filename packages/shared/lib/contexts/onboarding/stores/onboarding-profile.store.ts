import { derived, get, Readable, writable } from 'svelte/store'

import { isLedgerProfile } from '@core/profile'

import { IOnboardingProfile, IShimmerClaimingAccount } from '../interfaces'

export const onboardingProfile = writable<Partial<IOnboardingProfile>>(null)

export const isOnboardingLedgerProfile: Readable<boolean> = derived(onboardingProfile, ($onboardingProfile) =>
    isLedgerProfile($onboardingProfile?.type)
)

export function updateOnboardingProfile(payload: Partial<IOnboardingProfile>): void {
    return onboardingProfile.update((state) => ({ ...state, ...payload }))
}

export function updateShimmerClaimingAccount(shimmerClaimingAccount: IShimmerClaimingAccount): void {
    const _onboardingProfile = get(onboardingProfile)
    const claimingAccountIndex = shimmerClaimingAccount?.getMetadata()?.index
    const isNewShimmerClaimingAccount = !_onboardingProfile?.shimmerClaimingAccounts?.some(
        (_shimmerClaimingAccount) => _shimmerClaimingAccount?.getMetadata()?.index === claimingAccountIndex
    )
    const shimmerClaimingAccounts = isNewShimmerClaimingAccount
        ? [..._onboardingProfile?.shimmerClaimingAccounts, shimmerClaimingAccount]
        : _onboardingProfile?.shimmerClaimingAccounts?.map((_shimmerClaimingAccount) =>
              _shimmerClaimingAccount?.getMetadata()?.index === claimingAccountIndex
                  ? shimmerClaimingAccount
                  : _shimmerClaimingAccount
          )
    updateOnboardingProfile({ shimmerClaimingAccounts })
}
