import {
    activeProfile,
    activeWallets,
    addWalletPersistedDataToActiveProfile,
    createWallet,
    IPersistedProfile,
    login,
} from '@core/profile'
import { get } from 'svelte/store'
import { onboardingProfile } from '../stores'
import { createNewProfileFromOnboardingProfile } from './createNewProfileFromOnboardingProfile'
import { buildWalletPersistedData } from '@core/wallet'
import { localize } from '@core/i18n'
import { IOnboardingProfile } from '../interfaces'

export async function completeOnboardingProcess(): Promise<void> {
    // if we already have an active profile
    // it means we are trying to load again after an error
    // and we don't need to add it again
    if (!get(activeProfile)?.id) {
        createNewProfileFromOnboardingProfile()
    }

    const profile = get(onboardingProfile)
    if (!profile) {
        return
    }
    const { strongholdPassword } = profile

    await initWalletAndPersistedData(profile, strongholdPassword)
    void login({ isFromOnboardingFlow: true })

    onboardingProfile.set(undefined)
}

export async function initWalletAndPersistedData(
    profile: IOnboardingProfile,
    strongholdPassword?: string
): Promise<void> {
    // 1. Get the wallet name
    const walletName = `${localize('general.wallet')} ${(get(activeWallets)?.length ?? 0) + 1}`

    // 2. Create the wallet instance
    const wallet = await createWallet(profile as IPersistedProfile, strongholdPassword)

    // 3. Create the persisted data
    const walletPersistedData = await buildWalletPersistedData(profile.id, wallet, walletName)

    addWalletPersistedDataToActiveProfile(wallet.id, walletPersistedData)
}
