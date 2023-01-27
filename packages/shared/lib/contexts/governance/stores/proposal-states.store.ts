import { get, writable } from 'svelte/store'
import { getVotingProposalState } from '@contexts/governance/actions'
import { IProposalState } from '../interfaces'
import { activeAccounts, activeProfileId } from '@core/profile/stores'
import { persistedProposals } from '../stores'

export const proposalStates = writable<IProposalState>({})

export async function addProposalState(eventId: string): Promise<void> {
    const _proposalStates = get(proposalStates)

    const votingProposalState = await getVotingProposalState(eventId)

    _proposalStates[eventId] = { state: votingProposalState }
    proposalStates.set(_proposalStates)
}

export function removeProposalState(eventId: string): void {
    const _proposalStates = get(proposalStates)

    if (_proposalStates?.[eventId]) {
        delete _proposalStates[eventId]
        proposalStates.set(_proposalStates)
    }
}

export async function updateProposalsState(): Promise<void> {
    const _proposalStates = get(proposalStates)

    for (const eventId of Object.keys(_proposalStates ?? {})) {
        const votingProposalState = await getVotingProposalState(eventId)
        if (votingProposalState) {
            _proposalStates[eventId] = { state: votingProposalState }
        }
    }
    proposalStates.set(_proposalStates)
}

// Instead of fetching everything, only check if participated
export async function initializeProposalStates(): Promise<void> {
    const allProposals: IProposalState = {}
    const proposalsForActiveProfile = get(persistedProposals)[get(activeProfileId)] ?? {}

    for (const account of get(activeAccounts)) {
        const proposalsForAccount = proposalsForActiveProfile[account.index] ?? {}
        const registeredEventIds: string[] = Object.keys(proposalsForAccount)

        for (const eventId of registeredEventIds) {
            const proposalState = await getVotingProposalState(eventId, account)
            allProposals[eventId] = { state: proposalState }
        }
    }
    proposalStates.set(allProposals)
}
