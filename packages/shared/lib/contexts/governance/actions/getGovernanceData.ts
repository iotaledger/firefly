import { initializeRegisteredProposals } from './initializeRegisteredProposals'

export async function getGovernanceData(): Promise<void> {
    await initializeRegisteredProposals()
}
