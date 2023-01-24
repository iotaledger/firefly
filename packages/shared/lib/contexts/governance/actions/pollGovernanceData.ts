import { getVotingEventIds } from '@core/profile-manager/api'
import { PROPOSAL_STATUS_POLL_INTERVAL } from '../constants'
import { registeredEventIds, updateParticipationOverview, updateProposalsState } from '../stores'

let pollInterval

export async function pollGovernanceData(): Promise<void> {
    const eventIds = await getVotingEventIds()
    registeredEventIds.set(eventIds)

    await updateProposalsState()
    await updateParticipationOverview()

    pollInterval = setInterval(() => {
        void updateProposalsState()
        void updateParticipationOverview()
    }, PROPOSAL_STATUS_POLL_INTERVAL)
}

export function clearGovernancePollAndData(): void {
    clearInterval(pollInterval)
    registeredEventIds.set([])
}
