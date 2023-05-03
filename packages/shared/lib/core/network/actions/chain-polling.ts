import { CHAIN_STATUSES_POLL_INTERVAL } from '../constants'
import { updateChainStatuses } from './updateChainStatuses'

let pollInterval: number

export async function pollChainStatuses(): Promise<void> {
    await updateChainStatuses()
    pollInterval = window.setInterval(() => void updateChainStatuses(), CHAIN_STATUSES_POLL_INTERVAL)
}

export function clearChainStatusesPoll(): void {
    clearInterval(pollInterval)
}
