import type { Node, ParticipationEventWithNodes, ParticipationEventId } from '@iota/wallet'
import { IAccountState } from '@core/account'
import { addProposalState, addProposalToRegisteredProposals } from '../stores'
import { createProposalFromEvent } from '@contexts/governance'

export async function registerParticipationEvent(
    eventId: ParticipationEventId,
    node: Node,
    account: IAccountState
): Promise<ParticipationEventWithNodes> {
    const event = await account.registerParticipationEvent(eventId, [node])
    const proposal = await createProposalFromEvent(event)
    await addProposalState(eventId)
    addProposalToRegisteredProposals(proposal, account.index)

    return event
}
