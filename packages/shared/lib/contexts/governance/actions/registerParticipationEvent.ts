import { get } from 'svelte/store'
import type { Node, ParticipationEvent, ParticipationEventId } from '@iota/wallet'
import { selectedAccount } from '@core/account'
import { addProposalState, addProposalToPersistedProposals } from '../stores'
import { createProposalFromEvent } from '@contexts/governance'

export async function registerParticipationEvent(
    eventId: ParticipationEventId,
    node: Node
): Promise<ParticipationEvent> {
    const account = get(selectedAccount)
    const event = await account.registerParticipationEvent(eventId, [node])
    const proposal = await createProposalFromEvent(event, node.url)
    await addProposalState(eventId)
    addProposalToPersistedProposals(proposal, account.index)

    return event
}
