import {
    hasGeneratedALedgerReceiveAddress,
    isBackgroundSyncing,
    isFirstManualSync,
    isFirstSessionSync,
    isSyncing,
    isTransferring,
} from '@lib/wallet'
import { profileRecoveryType } from '@contexts/onboarding'

// TODO: move this out of profile module
export function resetDashboardState(): void {
    isTransferring.set(false)
    hasGeneratedALedgerReceiveAddress.set(false)
    isSyncing.set(null)
    isFirstSessionSync.set(true)
    isFirstManualSync.set(true)
    isBackgroundSyncing.set(false)
    profileRecoveryType.set(null)
}
