import { get } from 'svelte/store'

import { EventId, ParticipationEventType } from '@iota/wallet/out/types'

import { profileManager } from '../stores'

export function getVotingEventIds(): Promise<EventId[]> {
    const manager = get(profileManager)
    return manager?.getParticipationEventIds(ParticipationEventType.Voting)
}
