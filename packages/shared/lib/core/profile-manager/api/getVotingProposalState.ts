import { get } from 'svelte/store'
import { EventStatus, EventId } from '@iota/wallet'
import { profileManager } from '../stores'

export function getVotingProposalState(eventId: EventId): Promise<EventStatus> {
    const manager = get(profileManager)
    return manager.getParticipationEventStatus(eventId)
}
