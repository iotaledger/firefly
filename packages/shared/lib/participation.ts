import { get, writable } from 'svelte/store'
import { StakingAirdrop, StakingEventStatus } from './typings/participation'
import type { WalletAccount } from './typings/wallet'
import { persistent } from './helpers'

export const stakingEventStatus = writable<StakingEventStatus>(null)

/**
 * The store for accounts that are currently staked. This is NOT to hold accounts
 * that have been selected for staking / unstaking. In other words, if an account is
 * in this array, then it is currently being staked.
 */
export const stakedAccounts = persistent<WalletAccount[]>('stakedAccounts', [])

export const STAKING_AIRDROP_TOKENS: { [key in StakingAirdrop]: string } = {
    [StakingAirdrop.Assembly]: 'ASM',
    [StakingAirdrop.Shimmer]: 'SHMR',
}

export const isAccountStaked = (accountId: string): boolean =>
    get(stakedAccounts).find((a) => a.id === accountId) !== undefined

export const estimateStakingAirdropReward = (amount: number, airdrop: StakingAirdrop): number => {
    switch (airdrop) {
        case StakingAirdrop.Assembly:
            return amount * 10
        case StakingAirdrop.Shimmer:
            return amount * 20
        default:
            // TODO: Handle invalid cases better than setting to 0
            return 0
    }
}

// OLD
export const queryStakingEventStatus = (): StakingEventStatus => {
    return StakingEventStatus.PreStake
}
