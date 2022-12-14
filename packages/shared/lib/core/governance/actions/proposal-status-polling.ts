import { PROPOSAL_STATUS_POLL_INTERVAL } from '../constants'
import { updateProposalsStatus } from '../stores'

let pollInterval: NodeJS.Timeout

export async function pollProposalStatus(): Promise<void> {
    await updateProposalsStatus()
    pollInterval = setInterval(() => void updateProposalsStatus(), PROPOSAL_STATUS_POLL_INTERVAL)
}

export function clearPollProposalStatusInterval(): void {
    clearInterval(pollInterval)
}
