import { get, writable } from 'svelte/store'
import { getVotingProposalState } from '@contexts/governance/actions'
import { IProposalState } from '../interfaces'

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
