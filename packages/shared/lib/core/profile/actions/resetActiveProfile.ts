import { setSelectedAccount } from '@core/account'
import {
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
import { activeProfile } from '../stores'

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
