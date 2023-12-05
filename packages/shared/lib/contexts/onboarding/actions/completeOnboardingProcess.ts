import { activeProfile, activeWallets, addWalletPersistedDataToActiveProfile, createWallet, login } from '@core/profile'
import { get } from 'svelte/store'
import { OnboardingType } from '../enums'
import { addWalletPersistedDataToOnboardingProfile, onboardingProfile } from '../stores'
import { createNewProfileFromOnboardingProfile } from './createNewProfileFromOnboardingProfile'
import { showBalanceOverviewPopup } from '@contexts/dashboard/stores'
import { buildWalletStateAndPersistedData, createNewWallet, IWalletState } from '@core/wallet'
import { localize } from '@core/i18n'

export async function completeOnboardingProcess(): Promise<void> {
    // if we already have an active profile
    // it means we are trying to load again after an error
    // and we don't need to add it again
    console.log(get(activeProfile), get(onboardingProfile))
    if (!get(activeProfile)?.id) {
        createNewProfileFromOnboardingProfile()
    }

    console.log(get(activeProfile))

    const onboardingType = get(onboardingProfile)?.onboardingType
    const shouldRecoverAccounts = onboardingType === OnboardingType.Restore || onboardingType === OnboardingType.Claim
    showBalanceOverviewPopup.set(shouldRecoverAccounts)


    await createOnboardingWallet()
    
    void login({ isFromOnboardingFlow: true, shouldRecoverAccounts })

    onboardingProfile.set(undefined)
}

export async function createOnboardingWallet(name?: string, color?: string): Promise<IWalletState> {
    // 1. Get the wallet name
    const walletName = name || `${localize('general.account')} ${(get(activeWallets)?.length ?? 0) + 1}`;

    console.log("walletName", walletName)

    // 2. Create the wallet instance
    const wallet = await createWallet()

    console.log("wallet", wallet)

    // 3. Sync the wallet with the Node
    // TODO(2.0): test & fix sync when we have iota2.0 nodes
    //await account.sync(DEFAULT_SYNC_OPTIONS)

    // 4. Create a wrapper over the wallet instance and the persisted data
    const [walletState, accountPersistedData] = await buildWalletStateAndPersistedData(wallet, walletName, color)

    console.log("walletState", walletState, accountPersistedData)

    // TODO(2.0) Fix
    // addAccountToActiveAccounts(walletState)
    addWalletPersistedDataToOnboardingProfile(walletState.id, accountPersistedData)
    // TODO(2.0) Fix
    // addEmptyAccountActivitiesToAllAccountActivities(walletState.id)


    return walletState
}
