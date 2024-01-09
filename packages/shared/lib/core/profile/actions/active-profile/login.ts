import { initializeRegisteredProposals, registerProposalsFromNodes } from '@contexts/governance/actions'
import { cleanupOnboarding } from '@contexts/onboarding/actions'
import { Platform } from '@core/app/classes'
import { AppContext } from '@core/app/enums'
import { handleError } from '@core/error/handlers'
import { pollLedgerNanoStatus } from '@core/ledger/actions'
import { pollMarketPrices } from '@core/market/actions'
import { pollNetworkStatus } from '@core/network/actions'
import { loadNftsForActiveProfile } from '@core/nfts'
import { routerManager } from '@core/router/stores'
import { SECONDS_PER_MINUTE } from '@core/utils'
import {
    generateAndStoreActivitiesForAllWallets,
    isStrongholdUnlocked,
    refreshWalletAssetsForActiveProfile,
    setSelectedWallet,
} from '@core/wallet/actions'
import { get } from 'svelte/store'
import { CHECK_PREVIOUS_WALLETS_ARE_DESTROYED_TIMEOUT } from '../../constants'
import { ProfileType } from '../../enums'
import { ILoginOptions } from '../../interfaces'
import {
    activeProfile,
    activeWallets,
    incrementLoginProgress,
    isDestroyingWallets,
    resetLoginProgress,
    setTimeStrongholdLastUnlocked,
    updateActiveProfile,
} from '../../stores'
import { isLedgerProfile } from '../../utils'
import { loadWallets } from './loadWallets'
import { logout } from './logout'
import { subscribeToWalletApiEventsForActiveProfile } from './subscribeToWalletApiEventsForActiveProfile'
import { checkAndUpdateActiveProfileNetwork } from './checkAndUpdateActiveProfileNetwork'
import { checkAndRemoveProfilePicture } from './checkAndRemoveProfilePicture'
import { setStrongholdPasswordClearInterval, startBackgroundSync } from '@core/wallet/actions'

// TODO(2.0) Remove usage of profile manager
export async function login(loginOptions?: ILoginOptions): Promise<void> {
    const loginRouter = get(routerManager).getRouterForAppContext(AppContext.Login)
    try {
        const _activeProfile = get(activeProfile)
        const { loggedIn, lastActiveAt, id, isStrongholdLocked, type, lastUsedWalletId } = _activeProfile
        if (id) {
            // Step 1: Wait for wallets to be destroyed
            incrementLoginProgress()
            await waitForWalletsToBeDestroyed()

            // Step 2: Build wallets
            incrementLoginProgress()
            await loadWallets()

            let initialSelectedWalletId = get(activeWallets)?.[0]?.id
            if (lastUsedWalletId && get(activeWallets)?.find((wallet) => wallet.id === initialSelectedWalletId)) {
                initialSelectedWalletId = lastUsedWalletId
            }
            setSelectedWallet(initialSelectedWalletId)

            // Step 3: get node info to check we have a synced node
            incrementLoginProgress()
            await checkAndUpdateActiveProfileNetwork()
            void pollNetworkStatus()

            // Step 4: load assets
            incrementLoginProgress()
            await refreshWalletAssetsForActiveProfile(
                _activeProfile.forceAssetRefresh,
                _activeProfile.forceAssetRefresh
            )
            updateActiveProfile({ forceAssetRefresh: false })
            await loadNftsForActiveProfile()
            checkAndRemoveProfilePicture()

            // Step 5: generate and store activities for all wallets
            incrementLoginProgress()
            await generateAndStoreActivitiesForAllWallets()

            if (type === ProfileType.Software) {
                // Step 6: set initial stronghold status
                incrementLoginProgress()
                const strongholdUnlocked = await isStrongholdUnlocked()
                isStrongholdLocked.set(!strongholdUnlocked)
                await setStrongholdPasswordClearInterval(
                    _activeProfile.settings.strongholdPasswordTimeoutInMinutes * SECONDS_PER_MINUTE
                )
                if (strongholdUnlocked) {
                    setTimeStrongholdLastUnlocked()
                }
            } else {
                Platform.startLedgerProcess()
                incrementLoginProgress(2)
            }

            // Step 7: start background sync
            incrementLoginProgress()
            subscribeToWalletApiEventsForActiveProfile()
            await startBackgroundSync({ syncIncomingTransactions: true })

            // Step 8: finish login
            incrementLoginProgress()
            if (isLedgerProfile(type)) {
                pollLedgerNanoStatus()
            }
            lastActiveAt.set(new Date())
            loggedIn.set(true)
            setTimeout(() => {
                loginRouter?.next()
                resetLoginProgress()
            }, 500)

            void pollMarketPrices()
            if (Platform.isFeatureFlagEnabled('governance')) {
                void initializeRegisteredProposals()
                void registerProposalsFromNodes(get(activeWallets))
            }
            void cleanupOnboarding()
        } else {
            throw Error('No active profile error')
        }
    } catch (err) {
        console.error(err)
        handleError(err)
        if (!loginOptions?.isFromOnboardingFlow) {
            void logout(false)
        }
        loginRouter?.previous()
        resetLoginProgress()
    }
}

async function waitForWalletsToBeDestroyed(): Promise<void> {
    return new Promise((res, rej) => {
        if (!get(isDestroyingWallets)) return res()

        const unsub = isDestroyingWallets.subscribe((destroyed) => {
            if (!destroyed) {
                res()
                unsub()
                clearTimeout(timeout)
            }
        })

        const timeout = setTimeout(() => {
            rej()
            unsub()
        }, CHECK_PREVIOUS_WALLETS_ARE_DESTROYED_TIMEOUT)
    })
}
