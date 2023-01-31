import { get } from 'svelte/store'
import type { ParticipationEventId, ParticipationEventStatus } from '@iota/wallet'
import { selectedAccount } from '@core/account/stores'

export function getVotingProposalState(eventId: ParticipationEventId): Promise<ParticipationEventStatus> {
    const account = get(selectedAccount)
    return account?.getParticipationEventStatus(eventId)
}
