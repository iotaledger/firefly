import type {
    Node,
    ParticipationEventWithNodes,
    ParticipationEventId,
    ParticipationEventRegistrationOptions,
} from '@iota/wallet'
import { IAccountState } from '@core/account'
import { addOrUpdateProposalToRegisteredProposals } from '../stores'
import { createProposalFromEvent } from '@contexts/governance'

export async function registerParticipationEvent(
    eventId: ParticipationEventId,
    node: Node,
    account: IAccountState
): Promise<ParticipationEventWithNodes> {
    const options: ParticipationEventRegistrationOptions = {
        node,
        eventsToRegister: [eventId],
    }
    const eventMap = await account.registerParticipationEvents(options)
    const event = eventMap[eventId]

    const proposal = createProposalFromEvent(event)
    addOrUpdateProposalToRegisteredProposals(proposal, account.index)

    return event
}
