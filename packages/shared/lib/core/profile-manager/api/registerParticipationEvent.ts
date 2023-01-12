import { get } from 'svelte/store'

import type { Event, EventId, Node } from '@iota/wallet'

import { addProposalState, registeredEventIds } from '@contexts/governance/stores'

import { profileManager } from '../stores'

export async function registerParticipationEvent(eventId: EventId, nodes: Node[]): Promise<Event> {
    const manager = get(profileManager)
    const event = await manager.registerParticipationEvent(eventId, nodes)

    await addProposalState(eventId, nodes[0].url)

    registeredEventIds.update((ids) => [...ids, eventId])

    return event
}
