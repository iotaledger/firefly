import { get } from 'svelte/store'
import { EventStatus, EventId } from '@iota/wallet'
import { profileManager } from '@core/profile-manager'

export function getVotingProposalState(eventId: EventId): Promise<EventStatus> {
    const manager = get(profileManager)
    return manager.getParticipationEventStatus(eventId)
}
