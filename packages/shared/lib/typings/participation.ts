import type { Bridge, CommunicationIds } from './bridge'
import type { WalletAccount } from './wallet'
import type { Message } from './message'

export enum StakingAirdrop {
    Assembly = 'assembly',
    Shimmer = 'shimmer',
}

export enum StakingEventStatus {
    PreStake = 'prestake',
    Active = 'active',
    Ended = 'ended',
}

export enum ParticipationAction {
    Stake = 'stake',
    Unstake = 'unstake',
    Vote = 'vote',
}

export type ParticipationEventStatus = {
    milestoneIndex: number;
    status: string;
    checksum: string;
}

export type ParticipationEventInformation = {
    milestoneIndexCommence: number;
    milestoneIndexStart: number;
    milestoneIndexEnd: number;
    additionalInfo: string;
}

export type ParticipationEvent = {
    eventId: string;
    information: ParticipationEventInformation;
    status: ParticipationEventStatus
}

export interface ParticipateResponsePayload {
    accountId: string;
    messages: Message[]
}

export type Participation = {
    eventId: string;
    answers: string[];
}

export type AccountParticipationOverview = {
    accountIndex: string
    assemblyRewards: number
    assemblyUnstakedFunds: number
    assemblyStakedFunds: number
    shimmerRewards: number
    shimmerStakedFunds: number
    shimmerUnstakedFunds: number
    participations: Participation[]
}

// TODO: Change wallet.rs to return array directly instead of wrapped one.
export type ParticipationOverview = AccountParticipationOverview[]
export type ParticipationOverviewResponse = {
    accounts: AccountParticipationOverview[]
}

/**
 * Gets an overview of participation for accounts.
 * See #StakingOverview interface for more details.
 *
 * @method getParticipationOverview
 *
 * @param {Bridge} bridge
 * @param {CommunicationIds} __ids
 *
 * @returns {Promise<string>}
 */
 export function getParticipationOverview(bridge: Bridge, __ids: CommunicationIds): Promise<string> {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'GetParticipationOverview',
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
 export function participate(bridge: Bridge, __ids: CommunicationIds, accountId: string, participations: Participation[]): Promise<string> {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'Participate',
        payload: {
            account_identifier: accountId,
            participations
        }
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
 export function stopParticipating(bridge: Bridge, __ids: CommunicationIds, accountId: string, eventIds: string[]): Promise<string> {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'StopParticipating',
        payload: {
            account_identifier: accountId,
            event_ids: eventIds
        }
    })
}

/**
 * Participate in event(s) with additional funds
 *
 * @method participateWithRemainingFunds
 *
 * @param {Bridge} bridge
 * @param {CommunicationIds} __ids
 * @param {string} accountId
 * @param {Participation[]} eventIds
 *
 * @returns {Promise<string>}
 */
 export function participateWithRemainingFunds(bridge: Bridge, __ids: CommunicationIds, accountId: string, participations: Participation[]): Promise<string> {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'ParticipateWithRemainingFunds',
        payload: {
            account_identifier: accountId,
            participations
        }
    })
}
