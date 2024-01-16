import {
    activeProfile,
    activeWallets,
    addWalletPersistedDataToActiveProfile,
    addWalletToActiveWallets,
    createWallet,
    IPersistedProfile,
    login,
} from '@core/profile'
import { get } from 'svelte/store'
import { OnboardingType } from '../enums'
import { onboardingProfile } from '../stores'
import { createNewProfileFromOnboardingProfile } from './createNewProfileFromOnboardingProfile'
import { showBalanceOverviewPopup } from '@contexts/dashboard/stores'
import {
    addEmptyWalletActivitiesToAllWalletActivities,
    buildWalletStateAndPersistedData,
    IWalletState,
} from '@core/wallet'
import { DEFAULT_SYNC_OPTIONS } from '@core/wallet/constants'
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
    const { onboardingType, strongholdPassword } = profile

    const shouldRecoverWallets = onboardingType === OnboardingType.Restore || onboardingType === OnboardingType.Claim
    showBalanceOverviewPopup.set(shouldRecoverWallets)

    await initWallet(profile, strongholdPassword)
    void login({ isFromOnboardingFlow: true, shouldRecoverWallets })

    onboardingProfile.set(undefined)
}

export async function initWallet(profile: IOnboardingProfile, strongholdPassword?: string): Promise<IWalletState> {
    // 1. Get the wallet name
    const walletName = `${localize('general.wallet')} ${(get(activeWallets)?.length ?? 0) + 1}`

    // 2. Create the wallet instance
    const wallet = await createWallet(profile as IPersistedProfile, strongholdPassword)

    // 3. Sync the wallet with the Node
    await wallet.sync(DEFAULT_SYNC_OPTIONS)

    // 4. Create a wrapper over the wallet instance and the persisted data
    const [walletState, walletPersistedData] = await buildWalletStateAndPersistedData(wallet, walletName)

    addWalletToActiveWallets(walletState)
    addWalletPersistedDataToActiveProfile(walletState.id, walletPersistedData)
    addEmptyWalletActivitiesToAllWalletActivities(walletState.id)

    return walletState
}
