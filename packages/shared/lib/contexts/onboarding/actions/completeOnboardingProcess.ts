import { activeProfile, activeWallets, addWalletPersistedDataToActiveProfile, addWalletToActiveWallets, createWallet, login } from '@core/profile'
import { get } from 'svelte/store'
import { OnboardingType } from '../enums'
import { addWalletPersistedDataToOnboardingProfile, onboardingProfile } from '../stores'
import { createNewProfileFromOnboardingProfile } from './createNewProfileFromOnboardingProfile'
import { showBalanceOverviewPopup } from '@contexts/dashboard/stores'
import { addEmptyWalletActivitiesToAllWalletActivities, buildWalletStateAndPersistedData, createNewWallet, IWalletState } from '@core/wallet'
import { localize } from '@core/i18n'

export async function completeOnboardingProcess(): Promise<void> {
    // if we already have an active profile
    // it means we are trying to load again after an error
    // and we don't need to add it again
    if (!get(activeProfile)?.id) {
        createNewProfileFromOnboardingProfile()
    }

    const onboardingType = get(onboardingProfile)?.onboardingType
    const shouldRecoverWallets = onboardingType === OnboardingType.Restore || onboardingType === OnboardingType.Claim
    showBalanceOverviewPopup.set(shouldRecoverWallets)

    await createOnboardingWallet()
    void login({ isFromOnboardingFlow: true, shouldRecoverWallets })

    onboardingProfile.set(undefined)
}

export async function createOnboardingWallet(name?: string, color?: string): Promise<IWalletState> {
    // 1. Get the wallet name
    const walletName = name || `${localize('general.wallet')} ${(get(activeWallets)?.length ?? 0) + 1}`;

    // 2. Create the wallet instance
    const wallet = await createNewWallet()

    // 3. Sync the wallet with the Node
    // TODO(2.0): test & fix sync when we have iota2.0 nodes
    //await wallet.sync(DEFAULT_SYNC_OPTIONS)
    // 4. Create a wrapper over the wallet instance and the persisted data
    const [walletState, walletPersistedData] = await buildWalletStateAndPersistedData(wallet, walletName, color)

    // TODO(2.0) Fix
    addWalletToActiveWallets(walletState)
    addWalletPersistedDataToOnboardingProfile(walletState.id, walletPersistedData)
    // TODO(2.0) Fix
    addEmptyWalletActivitiesToAllWalletActivities(walletState.id)

    return walletState
}
