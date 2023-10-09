import { ChrysalisParticipationAction, ChrysalisStakingAirdrop } from '../enums'
import { IChrysalisStakingPeriodRewards } from '../interfaces'

export type ChrysalisAccountStakingRewards = {
    accountId: string
    [ChrysalisStakingAirdrop.Assembly]?: ChrysalisAirdropStakingRewards
    [ChrysalisStakingAirdrop.Shimmer]?: ChrysalisAirdropStakingRewards
}

export type ChrysalisAirdropStakingRewards = {
    totalAirdropRewards: number
    periods: ChrysalisStakingPeriod[]
}

export type ChrysalisStakingPeriod = {
    periodNumber: number
    totalPeriodRewards: number
    rewards: IChrysalisStakingPeriodRewards
}

export type ChrysalisParticipationHistoryItem = {
    accountId: string
    action: ChrysalisParticipationAction
    eventId: string
    messageId: string
}
