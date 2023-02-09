import { get } from 'svelte/store'

import { selectedAccount } from '@core/account/stores'
import { activeProfile } from '@core/profile/stores'

import { getVotingEventIds, isProposalAlreadyAddedForSelectedAccount } from '../utils'

import { registerParticipationEvent } from './registerParticipationEvent'

export async function registerProposalsFromPrimaryNode(): Promise<void> {
    const proposalIds = await getVotingEventIds()
    if (!proposalIds || proposalIds.length === 0) {
        return
    }

    const clientOptions = get(activeProfile)?.clientOptions
    if (!clientOptions) {
        throw new Error('Unable to retrieve profile client options')
    }

    const primaryNode = clientOptions?.primaryNode ?? clientOptions?.nodes[0]
    if (!primaryNode) {
        throw new Error('Unable to retrieve primary node')
    }

    const _selectedAccount = get(selectedAccount)
    await Promise.all(
        proposalIds.map(async (proposalId) => {
            if (!isProposalAlreadyAddedForSelectedAccount(proposalId)) {
                await registerParticipationEvent(proposalId, primaryNode, _selectedAccount)
            }
        })
    )
}
