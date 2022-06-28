import {
    hasGeneratedALedgerReceiveAddress,
    isBackgroundSyncing,
    isFirstManualSync,
    isFirstSessionSync,
    isSyncing,
    isTransferring,
    walletSetupType,
} from '@lib/wallet'

// TODO: move this out of profile module
export function resetDashboardState(): void {
    isTransferring.set(false)
    hasGeneratedALedgerReceiveAddress.set(false)
    isSyncing.set(null)
    isFirstSessionSync.set(true)
    isFirstManualSync.set(true)
    isBackgroundSyncing.set(false)
    walletSetupType.set(null)
}
