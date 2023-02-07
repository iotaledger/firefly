import { updateParticipationOverview } from '../stores'
import { initializeProposalStates } from './initializeProposalStates'
import { initializeRegisteredProposals } from './initializeRegisteredProposals'

export async function getGovernanceData(): Promise<void> {
    await updateParticipationOverview()
    await initializeRegisteredProposals()
    await initializeProposalStates()
}
