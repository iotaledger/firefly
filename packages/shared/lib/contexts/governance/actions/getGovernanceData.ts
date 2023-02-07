import { initializeParticipationOverviews } from './initializeParticipationOverviews'
import { initializeProposalStates } from './initializeProposalStates'
import { initializeRegisteredProposals } from './initializeRegisteredProposals'

export async function getGovernanceData(): Promise<void> {
    await initializeRegisteredProposals()
    await initializeProposalStates()
    await initializeParticipationOverviews()
}
