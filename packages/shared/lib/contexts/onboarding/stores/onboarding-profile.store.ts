import { derived, get, Readable, writable } from 'svelte/store'

import { isLedgerProfile } from '@core/profile'

import { IOnboardingProfile, IShimmerClaimingWallet } from '../interfaces'
import { IBaseToken, IPersistedWalletData } from '@core/wallet/interfaces'
import { IPersistedNetwork } from '@core/network'

export const onboardingProfile = writable<IOnboardingProfile | null | undefined>(null)

export const isOnboardingLedgerProfile: Readable<boolean> = derived(onboardingProfile, ($onboardingProfile) => {
    return isLedgerProfile($onboardingProfile?.type)
})

export const onboardingProfileNetwork: Readable<IPersistedNetwork | undefined> = derived(
    onboardingProfile,
    ($onboardingProfile) => $onboardingProfile?.network
)

export function updateOnboardingProfile(payload: Partial<IOnboardingProfile>): void {
    onboardingProfile.update((state) => ({ ...state, ...payload }))
}

export function updateShimmerClaimingAccount(shimmerClaimingAccount: IShimmerClaimingWallet): void {
    let shimmerClaimingAccounts = get(onboardingProfile)?.shimmerClaimingAccounts ?? []
    const claimingAccountIndex = shimmerClaimingAccount?.getMetadata()?.index
    const isNewShimmerClaimingAccount = !shimmerClaimingAccounts.some(
        (_shimmerClaimingAccount) => _shimmerClaimingAccount?.getMetadata()?.index === claimingAccountIndex
    )
    shimmerClaimingAccounts = isNewShimmerClaimingAccount
        ? [...shimmerClaimingAccounts, shimmerClaimingAccount]
        : shimmerClaimingAccounts?.map((_shimmerClaimingAccount) =>
              _shimmerClaimingAccount?.getMetadata()?.index === claimingAccountIndex
                  ? shimmerClaimingAccount
                  : _shimmerClaimingAccount
          )
    updateOnboardingProfile({ shimmerClaimingAccounts })
}

export function getOnboardingBaseToken(): IBaseToken {
    return get(onboardingProfile)?.network?.baseToken
}

export function addWalletPersistedDataToOnboardingProfile(
    walletId: string,
    walletPersistedData: IPersistedWalletData
): void {
    onboardingProfile?.update((state) => {
        if (!state?.walletPersistedData) {
            state.walletPersistedData = {}
        }
        state.walletPersistedData[walletId] = walletPersistedData
        return state
    })
}
