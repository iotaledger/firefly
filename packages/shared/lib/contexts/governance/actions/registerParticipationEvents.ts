import { ParticipationEventMap, ParticipationEventRegistrationOptions } from '@iota/wallet/out/types'

import { get } from 'svelte/store'

import { IAccountState } from '@core/account/interfaces'

import { addProposalsFromParticipationEventMap } from './addProposalsFromParticipationEventMap'
import { selectedAccount } from '@core/account'

export async function registerParticipationEvents(
    registrationOptions: ParticipationEventRegistrationOptions,
    account: IAccountState
): Promise<ParticipationEventMap> {
    const eventMap = await account.registerParticipationEvents(registrationOptions)

    if (get(selectedAccount).removedProposalsIds?.length > 0) {
        const notRemovedEventMap = Object.keys(eventMap)
            .filter((eventId) => !get(selectedAccount).removedProposalsIds.includes(eventId))
            .reduce((obj, key) => (obj[key] = eventMap[key]), {})
        addProposalsFromParticipationEventMap(eventMap, account)
        return notRemovedEventMap
    } else {
        addProposalsFromParticipationEventMap(eventMap, account)
        return eventMap
    }
}
