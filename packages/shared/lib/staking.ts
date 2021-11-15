import { writable } from 'svelte/store'
import { StakingAirdrop, StakingEventStatus } from './typings/staking'
import { HOURS_PER_DAY, MINUTES_PER_HOUR, SECONDS_PER_MINUTE } from './time'
import type { WalletAccount } from './typings/wallet'

export const stakingEventStatus = writable<StakingEventStatus>(null)

/**
 * The store for accounts that are currently staked. This is NOT to hold accounts
 * that have been selected for stake yet not actually staked.
 */
export const stakedAccounts = writable<WalletAccount[]>([])

export const STAKING_AIRDROP_TOKENS: { [key in StakingAirdrop]: string } = {
    [StakingAirdrop.Assembly]: 'ASM',
    [StakingAirdrop.Shimmer]: 'SHMR',
}

export const queryStakingEventStatus = (): StakingEventStatus => {
    return StakingEventStatus.PreStake
}

export const calculateStakingAirdrop = (amount: number, airdrop: StakingAirdrop): number => {
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
