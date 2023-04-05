import { ParticipationEventMap, ParticipationEventRegistrationOptions } from '@iota/wallet/out/types'

import { get } from 'svelte/store'

import { IAccountState } from '@core/account/interfaces'

import { addProposalsFromParticipationEventMap } from './addProposalsFromParticipationEventMap'
import { selectedAccount } from '@core/account'

export async function registerParticipationEvents(
    registrationOptions: ParticipationEventRegistrationOptions,
    account: IAccountState
): Promise<ParticipationEventMap> {
    let newRegistrationOptions = registrationOptions
    const { removedProposalIds } = get(selectedAccount) ?? {}
    if (removedProposalIds?.length > 0) {
        newRegistrationOptions = {
            ...registrationOptions,
            eventsToIgnore: removedProposalIds ?? [],
        }
    }

    const eventMap = await account.registerParticipationEvents(newRegistrationOptions)
    addProposalsFromParticipationEventMap(eventMap, account)
    return eventMap
}
