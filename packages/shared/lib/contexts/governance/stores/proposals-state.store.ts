import { get } from 'svelte/store'
import type { EventStatus } from '@iota/wallet'
import { getVotingProposalState } from '@core/profile-manager/api'
import { persistent } from '@core/utils/store'

export const proposalsState = persistent<{ [key in string]: EventStatus }>('proposalsState', {})

export async function addProposalState(eventId: string): Promise<void> {
    const _proposalsState = get(proposalsState)
    const hasRegisteredProposalStatus = Object.keys(_proposalsState).includes(eventId)
    if (!hasRegisteredProposalStatus) {
        const proposalStatus = await getVotingProposalState(eventId)
        _proposalsState[eventId] = proposalStatus
        proposalsState.set(_proposalsState)
    }
}

export function removeProposalState(eventId: string): void {
    const _proposalsState = get(proposalsState)
    const hasRegisteredProposalStatus = Object.keys(_proposalsState).includes(eventId)
    if (hasRegisteredProposalStatus) {
        delete _proposalsState[eventId]
        proposalsState.set(_proposalsState)
    }
}

export async function updateProposalsState(): Promise<void> {
    const _proposalsState = get(proposalsState)
    for (const eventId in _proposalsState) {
        const proposalStatus = await getVotingProposalState(eventId)
        _proposalsState[eventId] = proposalStatus
    }
    proposalsState.set(_proposalsState)
}
