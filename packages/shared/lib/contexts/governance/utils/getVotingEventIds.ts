import { get } from 'svelte/store'

import { ParticipationEventId, ParticipationEventType } from '@iota/wallet/out/types'

import { selectedAccount } from '@core/account/stores'

export function getVotingEventIds(): Promise<ParticipationEventId[]> {
    return get(selectedAccount)?.getParticipationEventIds(ParticipationEventType.Voting)
}
