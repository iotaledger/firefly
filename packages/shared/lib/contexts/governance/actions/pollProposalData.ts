import { PARTICIPATION_EVENT__STATUS_POLL_INTERVAL } from '../constants'
import { clearParticipationEventStatusPoll, pollParticipationEventStatus } from './pollParticipationEventStatus'

let pollInterval

export async function pollProposalData(proposalId: string): Promise<void> {
    await pollProposalDataHelper(proposalId)
    pollInterval = setInterval(() => {
        void pollProposalDataHelper(proposalId)
    }, PARTICIPATION_EVENT__STATUS_POLL_INTERVAL)
}

async function pollProposalDataHelper(proposalId: string): Promise<void> {
    try {
        await pollParticipationEventStatus(proposalId)
    } catch (err) {
        console.error(err)
    }
}

export function clearProposalDataPoll(): void {
    clearParticipationEventStatusPoll()
    clearInterval(pollInterval)
}
