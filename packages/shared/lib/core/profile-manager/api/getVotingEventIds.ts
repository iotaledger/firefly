import { get } from 'svelte/store'

import { EventId, ParticipationEventType } from '@iota/wallet/out/types'

import { profileManager } from '../stores'

export function getVotingEventIds(): Promise<EventId[]> {
    const manager = get(profileManager)
    /**
     * NOTE: The hard-coded "0" is referring to the voting event type. Using the
     * actual enum does not allow us to build the app.
     */
    return manager?.getParticipationEventIds(ParticipationEventType.Voting)
}
