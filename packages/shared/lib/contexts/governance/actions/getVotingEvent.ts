import { get } from 'svelte/store'
import type { ParticipationEventId, ParticipationEventWithNodes } from '@iota/wallet'
import { selectedAccount } from '@core/account/stores'

export function getVotingEvent(eventId: ParticipationEventId): Promise<ParticipationEventWithNodes> {
    const account = get(selectedAccount)
    return account.getParticipationEvent(eventId)
}
