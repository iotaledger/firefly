import type { WalletAccount } from './wallet'

export enum StakingAirdrop {
    Assembly = 'Assembly',
    Shimmer = 'Shimmer',
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
