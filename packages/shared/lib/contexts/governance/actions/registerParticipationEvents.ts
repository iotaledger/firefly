import { ParticipationEventMap, ParticipationEventRegistrationOptions } from '@iota/wallet/out/types'

import { IAccountState } from '@core/account/interfaces'

import { addProposalsFromParticipationEventMap } from './addProposalsFromParticipationEventMap'

export async function registerParticipationEvents(
    options: ParticipationEventRegistrationOptions,
    account: IAccountState
): Promise<ParticipationEventMap> {
    const eventMap = await account.registerParticipationEvents(options)
    addProposalsFromParticipationEventMap(eventMap, account)

    return eventMap
}
