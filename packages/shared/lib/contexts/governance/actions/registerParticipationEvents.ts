import {
    ParticipationEventMap,
    ParticipationEventRegistrationOptions,
    ParticipationEventWithNodes,
} from '@iota/wallet/out/types'

import { IAccountState } from '@core/account'

import { addOrUpdateProposalToRegisteredProposals } from '../stores'
import { createProposalFromEvent } from '../utils'

export async function registerParticipationEvents(
    options: ParticipationEventRegistrationOptions,
    account: IAccountState
): Promise<ParticipationEventMap> {
    const eventMap = await account.registerParticipationEvents(options)
    Object.values(eventMap).forEach((event: ParticipationEventWithNodes) => {
        const proposal = createProposalFromEvent(event)
        addOrUpdateProposalToRegisteredProposals(proposal, account.index)
    })

    return eventMap
}
