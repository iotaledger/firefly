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

export enum VotingAction {
    Cast = 'castVotes',
    Merge = 'mergeVotes',
    Stop = 'stopVotes',
    Change = 'changeVotes',
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
    questions: ParticipationEventStatusQuestion[]
}

/**
 * The question of a participation event status.
 */
export type ParticipationEventStatusQuestion = {
    answers: ParticipationEventStatusQuestionAnswer[]
}

/**
 * The answer of a participation event status question.
 */
export type ParticipationEventStatusQuestionAnswer = {
    value: number
    current: number
    accumulated: number
}

/**
 * An additional information payload embedded in ParticipationEventInformation,
 * containing more specific data regarding the event's reward system.
 */
export type ParticipationEventInformationPayload = {
    type: ParticipationEventType
    numerator?: number
    denominator?: number
    requiredMinimumRewards?: number
    symbol?: string
    text?: string
    additionalInfo?: string
    questions?: VotingEventQuestion[]
}

export type VotingEventQuestion = {
    text: string
    additionalInfo: string
    answers: VotingEventAnswer[]
}

export type VotingEventAnswer = {
    text: string
    additionalInfo: string
    value: string
}

/**
 * The more specific participation event information, indicating
 * the event's specific phase milestone transitions, and some more data.
 */
export type ParticipationEventInformation = {
    milestoneIndexCommence: number
    milestoneIndexStart: number
    milestoneIndexEnd: number
    additionalInfo: string
    payload: ParticipationEventInformationPayload
    name?: string
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
 * Tracked participation content
 */
export type TrackedParticipation = TrackedParticipationItem[]

/**
 * An individual tracked participation item struct.
 */
export type TrackedParticipationItem = {
    messageId: string
    amount: number
    startMilestoneIndex: number
    endMilestoneIndex: number
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
    trackedParticipations: TrackedParticipation[]
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
export type PendingParticipation = {
    messageId: string
    accountId: string
    action: ParticipationAction
    participations?: Participation[]
}

/**
 * The key-value type for Ed25519 addresses and their corresponding
 * airdrop reward amount.
 */
export type StakingPeriodRewards = {
    [address: string]: number
}

/**
 * The JSON schema for the staking period result files.
 */
export type StakingPeriodJsonResponse = {
    symbol: string
    milestoneIndex: number
    totalRewards: number
    checksum: string
    rewards: StakingPeriodRewards
}

/**
 * The staking airdrop rewards for completed events for each account.
 */
export type AccountStakingRewards = {
    accountId: string
    [StakingAirdrop.Assembly]?: AirdropStakingRewards
    [StakingAirdrop.Shimmer]?: AirdropStakingRewards
}

/**
 * The staking rewards for a particular airdrop.
 */
export type AirdropStakingRewards = {
    totalAirdropRewards: number
    periods: StakingPeriod[]
}

/**
 * The staking rewards information for a specific staking period.
 */
export type StakingPeriod = {
    periodNumber: number
    totalPeriodRewards: number
    rewards: StakingPeriodRewards
}

export type ParticipationHistoryItem = {
    accountId: string
    action: ParticipationAction
    eventId: string
    messageId: string
}
