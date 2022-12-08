import { profileManager } from '@core/profile-manager/stores'
import type { Event, EventId, Node } from '@iota/wallet'
import { get } from 'svelte/store'

export function registerParticipationEvent(eventId: EventId, nodes: Node[]): Promise<Event> {
    const manager = get(profileManager)
    return manager.registerParticipationEvent(eventId, nodes)
}
