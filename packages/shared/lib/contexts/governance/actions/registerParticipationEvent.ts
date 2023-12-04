import type {
    INode,
    ParticipationEventWithNodes,
    ParticipationEventId,
    ParticipationEventRegistrationOptions,
} from '@iota/sdk/out/types'
import { IWalletState } from '@core/wallet'
import { addOrUpdateProposalToRegisteredProposals } from '../stores'
import { createProposalFromEvent } from '@contexts/governance'

export async function registerParticipationEvent(
    eventId: ParticipationEventId,
    node: INode,
    account: IWalletState
): Promise<ParticipationEventWithNodes> {
    const options: ParticipationEventRegistrationOptions = {
        node,
        eventsToRegister: [eventId],
    }
    const eventMap = await account.registerParticipationEvents(options)
    const event = eventMap[eventId]

    const proposal = createProposalFromEvent(event)
    addOrUpdateProposalToRegisteredProposals(proposal, account.id)

    return event
}
