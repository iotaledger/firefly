import { Bridge, CommunicationIds } from '../typings/bridge'

import { Participation } from './types'

/**
 * Gets an overview of participation for accounts.
 * See #StakingOverview interface for more details.
 *
 * @method getParticipationOverview
 *
 * @param {Bridge} bridge
 * @param {CommunicationIds} __ids
 * @apram {string} assemblyEventId
 *
 * @returns {Promise<string>}
 */
export function getParticipationOverview(
    bridge: Bridge,
    __ids: CommunicationIds,
    assemblyEventId: string
): Promise<string> {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'GetParticipationOverview',
        payload: { assemblyEventId },
    })
}

/**
 * Gets participation event details
 *
 * @method getParticipationEvents
 *
 * @param {Bridge} bridge
 * @param {CommunicationIds} __ids
 *
 * @returns {Promise<string>}
 */
export function getParticipationEvents(bridge: Bridge, __ids: CommunicationIds): Promise<string> {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'GetParticipationEvents',
    })
}

/**
 * Participate in event(s)
 *
 * @method getParticipationEvents
 *
 * @param {Bridge} bridge
 * @param {CommunicationIds} __ids
 * @param {string} accountId
 * @param {Participation[]} participations
 *
 * @returns {Promise<string>}
 */
export function participate(
    bridge: Bridge,
    __ids: CommunicationIds,
    accountId: string,
    participations: Participation[]
): Promise<string> {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'Participate',
        payload: {
            account_identifier: accountId,
            participations,
        },
    })
}

/**
 * Stop participating in event(s)
 *
 * @method stopParticipating
 *
 * @param {Bridge} bridge
 * @param {CommunicationIds} __ids
 * @param {string} accountId
 * @param {string[]} eventIds
 *
 * @returns {Promise<string>}
 */
export function stopParticipating(
    bridge: Bridge,
    __ids: CommunicationIds,
    accountId: string,
    eventIds: string[]
): Promise<string> {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'StopParticipating',
        payload: {
            account_identifier: accountId,
            event_ids: eventIds,
        },
    })
}
