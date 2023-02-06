import { updateParticipationOverview } from '../stores'
import { initializeParticipationOverviews } from './initializeParticipationOverviews'
import { initializeProposalStates } from './initializeProposalStates'
import { initializeRegisteredProposals } from './initializeRegisteredProposals'

export async function getGovernanceData(): Promise<void> {
    await updateParticipationOverview()
    await initializeRegisteredProposals()
    await initializeProposalStates()
    await initializeParticipationOverviews()
}
