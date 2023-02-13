import { get } from 'svelte/store'

import { selectedAccount } from '@core/account/stores'
import { INode } from '@core/network/interfaces'

import { getVotingParticipationEventIds, isProposalAlreadyAddedForSelectedAccount } from '../utils'

import { registerParticipationEvent } from './registerParticipationEvent'

export async function registerProposalsFromNode(node: INode): Promise<void> {
    const proposalIds = await getVotingParticipationEventIds()
    if (!proposalIds || proposalIds.length === 0) {
        return
    }

    const _selectedAccount = get(selectedAccount)
    await Promise.all(
        proposalIds.map(async (proposalId) => {
            if (!isProposalAlreadyAddedForSelectedAccount(proposalId)) {
                await registerParticipationEvent(proposalId, node, _selectedAccount)
            }
        })
    )
}
