import { DEFAULT_SECONDS_PER_SLOT } from '../../network'
import { MILLISECONDS_PER_SECOND } from '../../utils'
import { syncBalance } from './syncBalance'

let balanceSyncInterval: number

export async function syncBalancePoll(walletId: string, syncCongestion: boolean): Promise<void> {
    await syncBalance(walletId, syncCongestion)
    balanceSyncInterval = window.setInterval(() => {
        void syncBalance(walletId, syncCongestion)
    }, DEFAULT_SECONDS_PER_SLOT * MILLISECONDS_PER_SECOND)
}

export function clearBalanceSyncPoll(): void {
    clearInterval(balanceSyncInterval)
}
