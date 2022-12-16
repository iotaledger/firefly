import { PROPOSAL_STATUS_POLL_INTERVAL } from '../constants'
import { updateProposalsState } from '../stores'

let pollInterval

export async function pollProposalsState(): Promise<void> {
    await updateProposalsState()
    pollInterval = setInterval(() => void updateProposalsState(), PROPOSAL_STATUS_POLL_INTERVAL)
}

export function clearPollProposalsStateInterval(): void {
    clearInterval(pollInterval)
}
