import { CHAIN_STATUSES_POLL_INTERVAL } from '../constants'
import { updateChainStatuses } from './updateChainStatuses'

let pollInterval: ReturnType<typeof setInterval>

export async function pollChainStatuses(): Promise<void> {
    await updateChainStatuses()
    pollInterval = setInterval(() => void updateChainStatuses(), CHAIN_STATUSES_POLL_INTERVAL)
}

export function clearChainStatusesPoll(): void {
    clearInterval(pollInterval)
}
