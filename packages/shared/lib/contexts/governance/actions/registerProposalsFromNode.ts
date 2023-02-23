import { get } from 'svelte/store'

import { selectedAccount } from '@core/account/stores'
import { INode } from '@core/network/interfaces'

import { getVotingParticipationEventIds, isProposalAlreadyAddedForSelectedAccount } from '../utils'

import { registerParticipationEvents } from './registerParticipationEvents'

export async function registerProposalsFromNode(node: INode): Promise<void> {
    const eventIds = await getVotingParticipationEventIds(node)
    if (!eventIds || eventIds.length === 0) {
        return
    }

    const eventsToRegister = eventIds.filter((eventId) => !isProposalAlreadyAddedForSelectedAccount(eventId))
    const options = {
        node,
        eventsToRegister,
    }
    await registerParticipationEvents(options, get(selectedAccount))
}
