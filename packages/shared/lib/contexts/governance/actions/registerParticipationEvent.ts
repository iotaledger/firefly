import { get } from 'svelte/store'

import type { Node, ParticipationEvent, ParticipationEventId } from '@iota/wallet'

import { selectedAccount } from '@core/account'

import { addProposalState, registeredEventIds } from '../stores'

export async function registerParticipationEvent(
    eventId: ParticipationEventId,
    nodes: Node[]
): Promise<ParticipationEvent> {
    const account = get(selectedAccount)
    const event = await account.registerParticipationEvent(eventId, nodes)

    await addProposalState(eventId, nodes[0].url)

    registeredEventIds.update((ids) => [...ids, eventId])

    return event
}
