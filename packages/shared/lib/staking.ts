import { writable } from 'svelte/store'
import { StakingAirdrop, StakingEventStatus } from './typings/staking'
import { HOURS_PER_DAY, MINUTES_PER_HOUR, SECONDS_PER_MINUTE } from './time'

export const stakingEventStatus = writable<StakingEventStatus>(null)

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
