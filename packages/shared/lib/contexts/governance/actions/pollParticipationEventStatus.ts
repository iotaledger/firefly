import { PROPOSAL_STATUS_POLL_INTERVAL } from '../constants'
import { updateProposalsState } from '../stores'

let pollInterval

export function pollParticipationEventStatus(eventId: string): void {
    void updateProposalsState(eventId)
    pollInterval = setInterval(() => {
        void updateProposalsState(eventId)
    }, PROPOSAL_STATUS_POLL_INTERVAL)
}

export function clearParticipationEventStatusPoll(): void {
    clearInterval(pollInterval)
}
