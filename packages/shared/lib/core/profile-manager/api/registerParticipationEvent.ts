import { addProposalState } from '@core/governance'
import { profileManager } from '@core/profile-manager/stores'
import type { Event, EventId, Node } from '@iota/wallet'
import { get } from 'svelte/store'

export async function registerParticipationEvent(eventId: EventId, nodes: Node[]): Promise<Event> {
    const manager = get(profileManager)
    const event = await manager.registerParticipationEvent(eventId, nodes)
    await addProposalState(eventId)
    return event
}
