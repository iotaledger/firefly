import { IAccountState, setSelectedAccount } from '@core/account'
import { buildAccountState } from '@core/account/helpers'
import { activeProfile, isSoftwareProfile } from '@core/profile'
import { getAccounts } from '@core/profile-manager'
import { accountRouter } from '@core/router'
import { Platform } from '@lib/platform'
import { openPopup } from '@lib/popup'
import { migrateObjects } from '@lib/utils'
import {
    api,
    asyncSyncAccountOffline,
    createAccount,
    hasGeneratedALedgerReceiveAddress,
    isBackgroundSyncing,
    isFirstManualSync,
    isFirstSessionSync,
    isSyncing,
    isTransferring,
    selectedMessage,
    transferState,
    walletSetupType,
} from '@lib/wallet'
import { get } from 'svelte/store'
import { buildNewProfile } from '../helpers'
import { IPersistedProfile } from '../interfaces'
import { profiles, saveProfile, setActiveProfile, setActiveProfileId, updateActiveProfile } from '../stores'

export function login(profileId: string): void {
    loadPersistedProfileIntoActiveProfile(profileId)
    // void loadAccounts()
}

export function loadPersistedProfileIntoActiveProfile(profileId: string): void {
    const persistedProfile = get(profiles).find((_persistedProfile) => _persistedProfile.id === profileId)
    if (persistedProfile) {
        setActiveProfileId(profileId)
        setActiveProfile(persistedProfile)
        Platform.updateActiveProfile(profileId)
    }
}

export async function loadAccounts(): Promise<void> {
    try {
        const { hasLoadedAccounts, accounts } = get(activeProfile)
        const accountsResponse = await getAccounts()
        if (accountsResponse.length === 0) {
            hasLoadedAccounts.set(true)
            return
        }

        if (accountsResponse) {
            const newAccounts: IAccountState[] = []
            for (const account of accountsResponse) {
                await account.sync()
                const newAccount = await buildAccountState(account)
                newAccounts.push(newAccount)
            }
            accounts.update((_accounts) => newAccounts.sort((a, b) => a.meta.index - b.meta.index))
            // updateBalanceOverview(meta.balance, meta.incoming, meta.outgoing)
            hasLoadedAccounts.set(true)
        }
    } catch (err) {
        console.error(err)
    }
}

// TODO: move to account module
export async function tryCreateAccount(alias: string, color: string, onComplete: (err?) => unknown): Promise<void> {
    const _create = async (): Promise<unknown> => {
        try {
            const account = await createAccount(alias, color)
            await asyncSyncAccountOffline(account)

            setSelectedAccount(account?.id)
            get(accountRouter).reset()

            return onComplete()
        } catch (err) {
            return onComplete(err)
        }
    }

    if (get(isSoftwareProfile)) {
        api.getStrongholdStatus({
            onSuccess(strongholdStatusResponse) {
                if (strongholdStatusResponse.payload.snapshot.status === 'Locked') {
                    openPopup({ type: 'password', props: { onSuccess: _create } })
                } else {
                    void _create()
                }
            },
            onError(error) {
                console.error(error)
            },
        })
    } else {
        await _create()
    }
}

// TODO: move this out of profile module
export function resetDashboardState(): void {
    setSelectedAccount(null)
    selectedMessage.set(null)
    isTransferring.set(false)
    transferState.set(null)
    hasGeneratedALedgerReceiveAddress.set(false)
    isSyncing.set(null)
    isFirstSessionSync.set(true)
    isFirstManualSync.set(true)
    isBackgroundSyncing.set(false)
    walletSetupType.set(null)
}

export function saveActiveProfile(): void {
    const _activeProfile = get(activeProfile)
    if (_activeProfile?.id) {
        // activeProfile contains more properties that IPersistedProfile
        // so we need to destructure only the properties that we want to persist
        const profileToPersist: IPersistedProfile = {
            id: _activeProfile?.id,
            name: _activeProfile?.name,
            type: _activeProfile?.type,
            networkProtocol: _activeProfile?.networkProtocol,
            networkType: _activeProfile?.networkType,
            lastStrongholdBackupTime: _activeProfile?.lastStrongholdBackupTime,
            settings: _activeProfile?.settings,
            isDeveloperProfile: _activeProfile?.isDeveloperProfile,
            ...(_activeProfile?.hiddenAccounts && { hiddenAccounts: _activeProfile?.hiddenAccounts }),
            ...(_activeProfile?.hasVisitedDashboard && { hasVisitedDashboard: _activeProfile?.hasVisitedDashboard }),
            ...(_activeProfile?.lastUsedAccountId && { lastUsedAccountId: _activeProfile?.lastUsedAccountId }),
            ...(_activeProfile?.accountMetadatas && { accountMetadatas: _activeProfile?.accountMetadatas }),
            ...(_activeProfile?.hasFinishedSingleAccountGuide && {
                hasFinishedSingleAccountGuide: _activeProfile?.hasFinishedSingleAccountGuide,
            }),
        }
        saveProfile(profileToPersist)
    }
}

/**
 * Migrates profile data in need of being modified to accommodate changes
 * in a newer Firefly version.
 * @method migrateActiveProfile
 * @returns {void}
 */
export function migrateActiveProfile(): void {
    const _activeProfile = get(activeProfile)
    const newProfileDefaults = buildNewProfile(
        _activeProfile?.name,
        _activeProfile?.isDeveloperProfile,
        _activeProfile?.networkProtocol,
        _activeProfile?.networkType
    )

    updateActiveProfile(migrateObjects<IPersistedProfile>(_activeProfile, newProfileDefaults))
}
