import { Message } from '../typings/message'

export enum AccountParticipationAbility {
    Ok = 'ok',
    HasDustAmount = 'hasDustAmount',
    HasPendingTransaction = 'hasPendingTransaction',
    WillNotReachMinAirdrop = 'willNotReachMinAirdrop',
}

/**
 * The official staking airdrops, Assembly (ASMB) and Shimmer (SMR).
 */
export enum StakingAirdrop {
    Assembly = 'assembly',
    Shimmer = 'shimmer',
}

/**
 * The possible actions a user can do regarding participation.
 */
export enum ParticipationAction {
    Stake = 'stake',
    Unstake = 'unstake',
    Vote = 'vote',
    Unvote = 'unvote',
}

/**
 * The possible participation event states, including an extra "inactive"
 * phase for extra cases (e.g. when the node doesn't have the participation plugin).
 */
export enum ParticipationEventState {
    Upcoming = 'upcoming',
    Commencing = 'commencing',
    Holding = 'holding',
    Ended = 'ended',
    Inactive = 'inactive',
}

/**
 * The possible types of participation events (only voting and staking).
 */
export enum ParticipationEventType {
    Voting = 0,
    Staking = 1,
}

/**
 * The status of a participation event.
 */
export type ParticipationEventStatus = {
    milestoneIndex: number
    /**
     * CAUTION: Ideally this property should be named
     * "state" to avoid confusion, but this is not possible
     * because of deserialization wallet.rs-side.
     */
    status: ParticipationEventState
    checksum: string
}

/**
 * An additional information payload embedded in ParticipationEventInformation,
 * containing more specific data regarding the event's reward system.
 */
export type ParticipationEventInformationPayload = {
    type: ParticipationEventType
    numerator: number
    denominator: number
    requiredMinimumRewards: number
    symbol: string
    text: string
    additionalInfo: string
}

/**
 * The more specific particiaption event information, indicating
 * the event's specific phase milestone transitions, and some more data.
 */
export type ParticipationEventInformation = {
    milestoneIndexCommence: number
    milestoneIndexStart: number
    milestoneIndexEnd: number
    additionalInfo: string
    payload: ParticipationEventInformationPayload
}

/**
 * The data corresponding to a participation event, including
 * both staking and voting events.
 */
export type ParticipationEvent = {
    eventId: string
    information: ParticipationEventInformation
    /**
     * CAUTION: Be careful not to confuse this
     * property with the nested "status" property
     * on this type.
     */
    status: ParticipationEventStatus
}

/**
 * The response returned from wallet.rs containing the
 * participation (protocol) messages.
 */
export type ParticipateResponsePayload = Message[]

/**
 * An individual participation struct.
 */
export type Participation = {
    eventId: string
    answers: string[]
}

/**
 * The struct containing all account-specific information
 * regarding staking, airdrop, rewards, participations
 * (including voting), and so on.
 */
export type AccountParticipationOverview = {
    accountIndex: number
    assemblyRewards: number
    assemblyRewardsBelowMinimum: number
    assemblyStakedFunds: number
    assemblyUnstakedFunds: number
    shimmerRewards: number
    shimmerRewardsBelowMinimum: number
    shimmerStakedFunds: number
    shimmerUnstakedFunds: number
    participations: Participation[]
}

/**
 * The unwrapped array of account participation overviews.
 */
export type ParticipationOverview = AccountParticipationOverview[]

/**
 * The response struct returned from wallet.rs containing the participation
 * overview.
 */
export type ParticipationOverviewResponse = {
    accounts: AccountParticipationOverview[]
}

/**
 * Pending participations type, useful for distinguishing between participations
 * that have or have not been confirmed yet.
 */
export interface PendingParticipation {
    messageId: string
    accountId: string
    action: ParticipationAction
}
