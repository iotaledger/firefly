import { isSyncing, isTransferring } from '@lib/wallet'

// TODO: move this out of profile module
export function resetDashboardState(): void {
    isTransferring.set(false)
    isSyncing.set(null)
}
