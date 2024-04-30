import { DEFAULT_SECONDS_PER_SLOT, getAndUpdateNodeInfo } from '../../network'
import { MILLISECONDS_PER_SECOND } from '../../utils'

let nodeSyncInterval: number

export async function syncNodeInfoPoll(): Promise<void> {
    await getAndUpdateNodeInfo()
    nodeSyncInterval = window.setInterval(() => {
        void getAndUpdateNodeInfo()
    }, DEFAULT_SECONDS_PER_SLOT * MILLISECONDS_PER_SECOND)
}

export function clearNodeInfoSyncPoll(): void {
    clearInterval(nodeSyncInterval)
}
