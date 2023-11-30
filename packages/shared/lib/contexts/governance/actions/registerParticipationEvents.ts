import { ParticipationEventMap, ParticipationEventRegistrationOptions } from '@iota/sdk/out/types'
import { getSelectedWallet, IWalletState } from 'shared/lib/core/wallet'

import { get } from 'svelte/store'


import { addProposalsFromParticipationEventMap } from './addProposalsFromParticipationEventMap'

export async function registerParticipationEvents(
    registrationOptions: ParticipationEventRegistrationOptions,
    wallet: IWalletState
): Promise<ParticipationEventMap> {
    let newRegistrationOptions = registrationOptions
    const { removedProposalIds } = getSelectedWallet() ?? {}
    if (removedProposalIds?.length > 0) {
        newRegistrationOptions = {
            ...registrationOptions,
            eventsToIgnore: removedProposalIds ?? [],
        }
    }

    const eventMap = await wallet.registerParticipationEvents(newRegistrationOptions)
    addProposalsFromParticipationEventMap(eventMap, wallet)
    return eventMap
}
