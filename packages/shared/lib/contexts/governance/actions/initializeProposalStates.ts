import { proposalStates, registeredProposals } from '../stores'
import { get } from 'svelte/store'
import { getVotingProposalState } from '@contexts/governance/actions'
import { IProposalState } from '../interfaces'
import { activeAccounts } from '@core/profile/stores'

// Instead of fetching everything, only check if participated
export async function initializeProposalStates(): Promise<void> {
    const allProposals: IProposalState = {}

    for (const account of get(activeAccounts)) {
        const proposalsForAccount = get(registeredProposals)[account.index] ?? {}
        const registeredEventIds: string[] = Object.keys(proposalsForAccount)

        for (const eventId of registeredEventIds) {
            const proposalState = await getVotingProposalState(eventId, account)
            allProposals[eventId] = { state: proposalState }
        }
    }
    proposalStates.set(allProposals)
}
