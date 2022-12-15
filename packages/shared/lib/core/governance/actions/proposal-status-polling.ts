import { PROPOSAL_STATUS_POLL_INTERVAL } from '../constants'
import { updateProposalsState } from '../stores'

let pollInterval: NodeJS.Timeout

export async function pollProposalStatus(): Promise<void> {
    await updateProposalsState()
    pollInterval = setInterval(() => void updateProposalsState(), PROPOSAL_STATUS_POLL_INTERVAL)
}

export function clearPollProposalStatusInterval(): void {
    clearInterval(pollInterval)
}
