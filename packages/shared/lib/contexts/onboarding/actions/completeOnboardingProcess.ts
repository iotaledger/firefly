import {
    activeProfile,
    activeWallets,
    addWalletPersistedDataToActiveProfile,
    createWallet,
    DirectoryManager,
    IPersistedProfile,
    login,
    logout,
} from '@core/profile'
import { get } from 'svelte/store'
import { onboardingProfile } from '../stores'
import { createNewProfileFromOnboardingProfile } from './createNewProfileFromOnboardingProfile'
import { buildWalletPersistedData } from '@core/wallet'
import { localize } from '@core/i18n'
import { IOnboardingProfile } from '../interfaces'
import { handleError } from '@core/error/handlers'

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

    try {
        await initWalletAndPersistedData(profile, strongholdPassword)
        void login({ isFromOnboardingFlow: true })

        onboardingProfile.set(undefined)
    } catch (err) {
        console.error(err)
        handleError(err)
        void logout(false)
    }
}

export async function initWalletAndPersistedData(
    profile: IOnboardingProfile,
    strongholdPassword?: string
): Promise<void> {
    // 1. Get the wallet name
    const walletName = `${localize('general.wallet')} ${(get(activeWallets)?.length ?? 0) + 1}`

    // 2. Create the wallet instance
    const wallet = await createWallet(profile as IPersistedProfile, strongholdPassword)

    // 3. Restore from stronghold if needed
    if (profile.importFilePath && strongholdPassword) {
        const strongholdBackupPath = await DirectoryManager.forStrongholdBackup(profile.id)
        await wallet.restoreFromStrongholdSnapshot(strongholdBackupPath, strongholdPassword, true)
    }

    // 4. Create the persisted data
    const walletPersistedData = await buildWalletPersistedData(profile.id, wallet, walletName)

    addWalletPersistedDataToActiveProfile(wallet.id, walletPersistedData)
}
