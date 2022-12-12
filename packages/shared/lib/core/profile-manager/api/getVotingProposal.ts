import { get } from 'svelte/store'
import { Event, EventId } from '@iota/wallet'
import { profileManager } from '@core/profile-manager'

export function getVotingEvent(eventId: EventId): Promise<Event> {
    const manager = get(profileManager)
    return manager.getParticipationEvent(eventId)
}
