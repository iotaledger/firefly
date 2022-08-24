import { derived, get, Readable, writable } from 'svelte/store'

import { isLedgerProfileHelper } from '@core/profile'

import { IOnboardingProfile, IShimmerClaimingAccount } from '../interfaces'

export const onboardingProfile = writable<Partial<IOnboardingProfile>>(null)

export const isOnboardingLedgerProfile: Readable<boolean> = derived(onboardingProfile, ($onboardingProfile) =>
    isLedgerProfileHelper($onboardingProfile?.type)
)

export function updateOnboardingProfile(payload: Partial<IOnboardingProfile>): void {
    return onboardingProfile.update((state) => ({ ...state, ...payload }))
}

export function updateShimmerClaimingAccount(shimmerClaimingAccount: IShimmerClaimingAccount): void {
    const _onboardingProfile = get(onboardingProfile)
    const isNewShimmerClaimingAccount = !_onboardingProfile?.shimmerClaimingAccounts?.some(
        (_shimmerClaimingAccount) => _shimmerClaimingAccount?.meta?.index === shimmerClaimingAccount?.meta?.index
    )
    const shimmerClaimingAccounts = isNewShimmerClaimingAccount
        ? [..._onboardingProfile?.shimmerClaimingAccounts, shimmerClaimingAccount]
        : _onboardingProfile?.shimmerClaimingAccounts?.map((_shimmerClaimingAccount) =>
              _shimmerClaimingAccount?.meta?.index === shimmerClaimingAccount?.meta?.index
                  ? shimmerClaimingAccount
                  : _shimmerClaimingAccount
          )
    updateOnboardingProfile({ shimmerClaimingAccounts })
}
