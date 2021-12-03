import type { Message } from '../typings/message'

export enum StakingAirdrop {
    Assembly = 'assembly',
    Shimmer = 'shimmer',
}

export enum ParticipationAction {
    Stake = 'stake',
    Unstake = 'unstake',
    Vote = 'vote',
    Unvote = 'unvote',
}

export enum ParticipationEventState {
    Upcoming = 'upcoming',
    Commencing = 'commencing',
    Holding = 'holding',
    Ended = 'ended',
    Inactive = 'inactive',
}

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

export type ParticipationEventInformation = {
    milestoneIndexCommence: number
    milestoneIndexStart: number
    milestoneIndexEnd: number
    additionalInfo: string
}

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

export type ParticipateResponsePayload = Message[]
// export interface ParticipateResponsePayload {
//     accountId: string
//     messages: Message[]
// }

export type Participation = {
    eventId: string
    answers: string[]
}

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

// TODO: Change wallet.rs to return array directly instead of wrapped one.
export type ParticipationOverview = AccountParticipationOverview[]
export type ParticipationOverviewResponse = {
    accounts: AccountParticipationOverview[]
}
