import { PROPOSAL_STATUS_POLL_INTERVAL } from '../constants'
import { updateParticipationOverview, updateProposalsState } from '../stores'

let pollInterval

export async function pollGovernanceData(): Promise<void> {
    await updateProposalsState()
    await updateParticipationOverview()

    pollInterval = setInterval(() => {
        void updateProposalsState()
        void updateParticipationOverview()
    }, PROPOSAL_STATUS_POLL_INTERVAL)
}

export function clearPollGovernanceDataInterval(): void {
    clearInterval(pollInterval)
}
