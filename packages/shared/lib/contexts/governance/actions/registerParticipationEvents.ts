import type { ParticipationEventMap, ParticipationEventRegistrationOptions } from '@iota/wallet/out/types'

import { IAccountState } from '@core/account'

import { addProposalToRegisteredProposals } from '../stores'
import { createProposalFromEvent } from '../utils'

export async function registerParticipationEvents(
    options: ParticipationEventRegistrationOptions,
    account: IAccountState
): Promise<ParticipationEventMap> {
    const eventMap = await account.registerParticipationEvents(options)
    Object.values(eventMap).forEach((event) => {
        const proposal = createProposalFromEvent(event)
        addProposalToRegisteredProposals(proposal, account.index)
    })

    return eventMap
}
