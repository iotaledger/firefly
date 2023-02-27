import { get } from 'svelte/store'

import { ParticipationEventId, ParticipationEventType } from '@iota/wallet/out/types'

import { selectedAccount } from '@core/account/stores'
import { INode } from '@core/network/interfaces'

export function getVotingParticipationEventIds(node: INode): Promise<ParticipationEventId[]> {
    return get(selectedAccount)?.getParticipationEventIds(node, ParticipationEventType.Voting)
}
