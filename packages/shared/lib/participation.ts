import { get, writable } from 'svelte/store'
import { StakingAirdrop, StakingEventStatus } from './typings/participation'
import type { WalletAccount } from './typings/wallet'
import { persistent } from './helpers'

/**
 * The store for if a user currently has partially staked funds on a staked
 * account or not. This is updated regularly by the polling in `wallet.rs`.
 */
export const hasPartiallyStakedFunds = writable<boolean>(true)

/**
 * The store for the current status of the staking events. This is the source of truth
 * across the app determining whether the staking is enabled, what UI to show, i.e. anything
 * dependent on the state of the events. This is updated regularly by the polling in `wallet.rs`.
 */
export const stakingEventStatus = writable<StakingEventStatus>(null)

/**
 * The store for accounts that are currently staked. This is NOT to hold accounts
 * that have been selected for staking / unstaking. In other words, if an account is
 * in this array, then it is currently being staked. This is updated regularly by the polling
 * in `wallet.rs`.
 */
export const stakedAccounts = persistent<WalletAccount[]>('stakedAccounts', [])

export const STAKING_AIRDROP_TOKENS: { [key in StakingAirdrop]: string } = {
    [StakingAirdrop.Assembly]: 'ASM',
    [StakingAirdrop.Shimmer]: 'SMR',
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
