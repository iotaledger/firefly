import { ParticipationEventMap, ParticipationEventRegistrationOptions } from '@iota/wallet/out/types'

import { IAccountState } from '@core/account/interfaces'

import { addProposalsFromParticipationEventMap } from './addProposalsFromParticipationEventMap'

export async function registerParticipationEvents(
    registrationOptions: ParticipationEventRegistrationOptions,
    account: IAccountState
): Promise<ParticipationEventMap> {
    const eventMap = await account.registerParticipationEvents(registrationOptions)
    addProposalsFromParticipationEventMap(eventMap, account)

    return eventMap
}
