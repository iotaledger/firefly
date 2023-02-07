import { PROPOSAL_STATUS_POLL_INTERVAL } from '../constants'
import { updateParticipationOverview, updateProposalsState } from '../stores'

let pollInterval

export function pollGovernanceData(): void {
    pollInterval = setInterval(() => {
        void updateProposalsState()
        void updateParticipationOverview()
    }, PROPOSAL_STATUS_POLL_INTERVAL)
}

export function clearGovernancePollAndData(): void {
    clearInterval(pollInterval)
}
