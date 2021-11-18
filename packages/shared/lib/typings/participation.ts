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

export enum StakingAction {
    Stake = 'stake',
    Unstake = 'unstake',
    Nothing = 'nothing',
}

export interface StakingSelection {
    account: WalletAccount
    action: StakingAction
}

export type StakingAccountOverview = {
    accountId: string
    stakedAmount: number
    assemblyRewards: number
    shimmerRewards: number
}

export type StakingOverview = StakingAccountOverview[]

export type StakedAccountPayload = {
    accountId: string
    messages: Message[]
}
