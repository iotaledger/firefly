import { get } from 'svelte/store'

import { INode, ParticipationEventId } from '@iota/wallet'
import { ParticipationEventType } from '@iota/wallet/out/types'

import { selectedAccount } from '@core/account/stores'

export function getVotingParticipationEventIds(node: INode): Promise<ParticipationEventId[]> | undefined {
    return get(selectedAccount)?.getParticipationEventIds(node, ParticipationEventType.Voting)
}
