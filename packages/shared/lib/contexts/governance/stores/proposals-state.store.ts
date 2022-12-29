import { get } from 'svelte/store'
import { getVotingProposalState } from '@core/profile-manager/api'
import { activeProfileId } from '@core/profile/stores'
import { persistent } from '@core/utils/store'
import { IProposalState } from '../interfaces'

export const proposalsState = persistent<IProposalState>('proposalsState', {})

export async function addProposalState(eventId: string, nodeUrl: string): Promise<void> {
    const profileId = get(activeProfileId)
    const _proposalsState = get(proposalsState)

    const votingProposalState = await getVotingProposalState(eventId)

    if (!_proposalsState[profileId]) {
        _proposalsState[profileId] = {}
    }

    _proposalsState[profileId][eventId] = { state: votingProposalState, nodeUrl }
    proposalsState.set(_proposalsState)
}

export function removeProposalState(eventId: string): void {
    const profileId = get(activeProfileId)
    const _proposalsState = get(proposalsState)

    if (_proposalsState[profileId]?.[eventId]) {
        delete _proposalsState[profileId][eventId]
        proposalsState.set(_proposalsState)
    }
}

export async function updateProposalsState(): Promise<void> {
    const profileId = get(activeProfileId)
    if (!profileId) {
        return
    }

    const _proposalsState = get(proposalsState)

    for (const eventId of Object.keys(_proposalsState[profileId] ?? {})) {
        const votingProposalState = await getVotingProposalState(eventId)
        _proposalsState[profileId][eventId].state = votingProposalState
    }
    proposalsState.set(_proposalsState)
}
