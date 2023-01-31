import { get } from 'svelte/store'

import { activeProfile } from '@core/profile/stores'

import { isProposalAlreadyAdded } from '../utils'

import { registerParticipationEvent } from './registerParticipationEvent'

export async function registerProposalsFromPrimaryNode(): Promise<void> {
    // const proposalIds = await getVotingEventIds()
    // console.log('IDs: ', proposalIds)

    const proposalIds = [
        '0x00d77d8fe83ed844ee67027c8d6e22da6a6ddbcb84dccedd0a1517d56e8ae258',
        '0x351da77ad4798b917fd396191983afe4c101bfc485905f9dd7283350e2d9e15b',
        '0x6d27606a773a3c87c151af09ad58ddc831864e2141ef598075dc24be5668ca7f',
        '0x8edfcd987d10deafc6977207a73685c85709745e53c74a14ecdbf17945d86da3',
        '0xb6e56dc4b4a0af6b535c3be045c128e9ae135c7a234a8aef90bb2a6d17109bbf',
    ]

    const clientOptions = get(activeProfile)?.clientOptions
    if (!clientOptions) {
        throw new Error('Unable to retrieve profile client options')
    }

    const primaryNode = clientOptions?.primaryNode ?? clientOptions?.nodes[0]
    if (!primaryNode) {
        throw new Error('Unable to retrieve primary node')
    }

    await Promise.all(
        proposalIds.map(async (proposalId) => {
            if (!isProposalAlreadyAdded(proposalId)) {
                await registerParticipationEvent(proposalId, [primaryNode])
            }
        })
    )
}
