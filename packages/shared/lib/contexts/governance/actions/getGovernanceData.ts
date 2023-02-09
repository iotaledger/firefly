import { GovernanceLoadingState } from '../enums'
import { governanceLoadingState } from '../stores/governance-loading-state.store'
import { initializeParticipationOverviews } from './initializeParticipationOverviews'
import { initializeProposalStates } from './initializeProposalStates'
import { initializeRegisteredProposals } from './initializeRegisteredProposals'

export async function getGovernanceData(): Promise<void> {
    governanceLoadingState.set(GovernanceLoadingState.NothingLoaded)
    await initializeRegisteredProposals()
    governanceLoadingState.set(GovernanceLoadingState.MetadataLoaded)
    await initializeProposalStates()
    await initializeParticipationOverviews()
    governanceLoadingState.set(GovernanceLoadingState.Completed)
}
