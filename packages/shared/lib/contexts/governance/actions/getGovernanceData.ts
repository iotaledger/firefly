import { initializeProposalStates, updateParticipationOverview } from '../stores'

export async function getGovernanceData(): Promise<void> {
    await initializeProposalStates()
    await updateParticipationOverview()
}
