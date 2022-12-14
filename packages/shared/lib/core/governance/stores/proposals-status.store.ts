import { getProposalStatus } from '@core/profile-manager'
import { persistent } from '@core/utils/store'
import { EventStatus } from '@iota/wallet'
import { get } from 'svelte/store'

export const proposalsStatus = persistent<{ [key in string]: EventStatus }>('proposalsStatus', {})

export async function addProposalStatus(eventId: string): Promise<void> {
    const _proposalsStatus = get(proposalsStatus)
    const hasRegisteredProposalStatus = Object.keys(_proposalsStatus).includes(eventId)
    if (!hasRegisteredProposalStatus) {
        const proposalStatus = await getProposalStatus(eventId)
        _proposalsStatus[eventId] = proposalStatus
        proposalsStatus.set(_proposalsStatus)
    }
}

export function removeProposalStatus(eventId: string): void {
    const _proposalsStatus = get(proposalsStatus)
    const hasRegisteredProposalStatus = Object.keys(_proposalsStatus).includes(eventId)
    if (hasRegisteredProposalStatus) {
        delete _proposalsStatus[eventId]
        proposalsStatus.set(_proposalsStatus)
    }
}

export async function updateProposalsStatus(): Promise<void> {
    const _proposalsStatus = get(proposalsStatus)
    for (const eventId in _proposalsStatus) {
        const proposalStatus = await getProposalStatus(eventId)
        _proposalsStatus[eventId] = proposalStatus
    }
    proposalsStatus.set(_proposalsStatus)
}
