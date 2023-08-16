import { get } from 'svelte/store'

import { INode, ParticipationEventId, ParticipationEventType } from '@iota/sdk/out/types'

import { selectedAccount } from '@core/account/stores'

export function getVotingParticipationEventIds(node: INode): Promise<ParticipationEventId[]> | undefined {
    return get(selectedAccount)?.getParticipationEventIds(node, ParticipationEventType.Voting)
}
