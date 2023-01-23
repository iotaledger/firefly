import { get } from 'svelte/store'
import type { ParticipationEvent, ParticipationEventId } from '@iota/wallet'
import { selectedAccount } from '@core/account/stores'

export function getVotingEvent(eventId: ParticipationEventId): Promise<ParticipationEvent> {
    const account = get(selectedAccount)
    return account.getParticipationEvent(eventId)
}
