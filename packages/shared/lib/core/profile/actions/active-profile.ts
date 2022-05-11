import { setSelectedAccount } from '@core/account'
import { activeProfile, isSoftwareProfile } from '@core/profile'
import { accountRouter } from '@core/router'
import { openPopup } from '@lib/popup'
import { StardustAccount } from '@lib/typings/account'
import { WalletAccount } from '@lib/typings/walletAccount'
import {
    api,
    asyncSyncAccountOffline,
    createAccount,
    getStardustAccount,
    hasGeneratedALedgerReceiveAddress,
    isBackgroundSyncing,
    isFirstManualSync,
    isFirstSessionSync,
    isSyncing,
    isTransferring,
    prepareAccountInfo,
    profileManager,
    selectedMessage,
    transferState,
    updateBalanceOverview,
    walletSetupType,
} from '@lib/wallet'
import { get } from 'svelte/store'
import { IPersistedProfile } from '../interfaces'
import { activeProfileId, saveProfile } from '../stores'

// Move to profile manager module
export async function getAccounts(): Promise<StardustAccount[]> {
    const accountsResponse = await get(profileManager).getAccounts()
    const accountsPromises = accountsResponse.map((acc) => getStardustAccount(acc.meta.index))
    return Promise.all(accountsPromises)
}

export async function loadAccounts(): Promise<void> {
    try {
        const { hasLoadedAccounts, accounts } = get(activeProfile)
        const accountsResponse = await getAccounts()
        if (accountsResponse) {
            if (accountsResponse.length === 0) {
                hasLoadedAccounts.set(true)
                return
            }

            const meta = {
                balance: 0,
                incoming: 0,
                outgoing: 0,
                depositAddress: '',
            }

            const newAccounts: WalletAccount[] = []
            for (const payloadAccount of accountsResponse) {
                const balance = await payloadAccount.balance()
                // TODO: check if this is neccessary -> mainly for showing a correct graph
                // addMessagesPair(payloadAccount)

                meta.balance += balance.available
                meta.incoming += balance.incoming
                meta.outgoing += balance.outgoing
                meta.depositAddress = payloadAccount.meta.publicAddresses[0].toString()

                const account = prepareAccountInfo(payloadAccount, meta)
                newAccounts.push(account)
            }
            accounts.update((_accounts) => newAccounts.sort((a, b) => a.meta.index - b.meta.index))
            // TODO: fix migrations
            // processMigratedTransactions(
            //     payloadAccount.id,
            //     payloadAccount.messages,
            //     payloadAccount.addresses
            // )
            updateBalanceOverview(meta.balance, meta.incoming, meta.outgoing)
            hasLoadedAccounts.set(true)
        }
    } catch (err) {
        console.error(err)
    }
}

// move to account module
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

/**
 * Sets profile with provided id as active
 * @method setActiveProfile
 * @param {string} id
 * @returns {void}
 */
export function setActiveProfile(id: string): void {
    activeProfileId.set(id)
}

/**
 * Clears the active profile
 * @method clearActiveProfile
 * @returns {void}
 */
export function clearActiveProfile(): void {
    activeProfileId.set(null)
}

export function resetActiveProfile(): void {
    const { balanceOverview, accounts, hasLoadedAccounts, internalTransfersInProgress } = get(activeProfile)
    balanceOverview.set({
        incoming: '0 Mi',
        incomingRaw: 0,
        outgoing: '0 Mi',
        outgoingRaw: 0,
        balance: '0 Mi',
        balanceRaw: 0,
        balanceFiat: '$ 0.00',
    })
    accounts.set([])
    hasLoadedAccounts.set(false)
    internalTransfersInProgress.set({})
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
        const profileToPersist: IPersistedProfile = {
            id: _activeProfile.id,
            name: _activeProfile.name,
            type: _activeProfile.type,
            networkProtocol: _activeProfile.networkProtocol,
            networkType: _activeProfile.networkType,
            lastStrongholdBackupTime: _activeProfile.lastStrongholdBackupTime,
            settings: _activeProfile.settings,
            isDeveloperProfile: _activeProfile.isDeveloperProfile,
            ...(_activeProfile.hiddenAccounts && { hiddenAccounts: _activeProfile.hiddenAccounts }),
            ...(_activeProfile.hasVisitedDashboard && { hasVisitedDashboard: _activeProfile.hasVisitedDashboard }),
            ...(_activeProfile.lastUsedAccountId && { lastUsedAccountId: _activeProfile.lastUsedAccountId }),
            ...(_activeProfile.accountMetadata && { accountMetadata: _activeProfile.accountMetadata }),
            ...(_activeProfile.hasFinishedSingleAccountGuide && {
                hasFinishedSingleAccountGuide: _activeProfile.hasFinishedSingleAccountGuide,
            }),
        }
        saveProfile(profileToPersist)
    }
}
