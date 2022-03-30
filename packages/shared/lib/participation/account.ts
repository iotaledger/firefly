import { derived, Readable } from 'svelte/store'
import { selectedAccount } from '../wallet'
import { participationOverview } from './stores'
import { AccountParticipationOverview, StakingAirdrop } from './types'

// TODO: This is a temporary workaround because of circular dependency
export const selectedAccountParticipationOverview = derived(
    [participationOverview, selectedAccount],
    ([$participationOverview, $selectedAccount]) =>
        $participationOverview?.find(({ accountIndex }) => accountIndex === $selectedAccount?.index) ?? null
)

/**
 * The amount of funds that are currently staked on the selected account. This amount may differ
 * between airdrops, so we pick the highest number (this is only possible
 * because the same funds may be staked for both airdrops).
 */
export const stakedAmount: Readable<number> = derived(
    selectedAccountParticipationOverview,
    ($selectedAccountParticipationOverview) => {
        let total = 0
        if ($selectedAccountParticipationOverview) {
            const { shimmerStakedFunds, assemblyStakedFunds } = $selectedAccountParticipationOverview
            if (shimmerStakedFunds > 0 && assemblyStakedFunds > 0) {
                total += Math.max(shimmerStakedFunds, assemblyStakedFunds)
            } else {
                total += shimmerStakedFunds
                total += assemblyStakedFunds
            }
        }
        return total
    }
)

/**
 * The amount of funds that are currently unstaked on the selected account. This amount may differ
 * between airdrops, so we pick the lowest number (this is only possible
 * because the same funds may be staked for both airdrops).
 */
export const unstakedAmount: Readable<number> = derived(
    selectedAccountParticipationOverview,
    ($selectedAccountParticipationOverview) => {
        let total = 0
        if ($selectedAccountParticipationOverview) {
            const { shimmerUnstakedFunds, assemblyUnstakedFunds } = $selectedAccountParticipationOverview
            total += Math.min(shimmerUnstakedFunds, assemblyUnstakedFunds)
        }
        return total
    }
)

// TODO: replace its old use partiallyStakedAccounts
export const isPartiallyStaked: Readable<boolean> = derived(
    selectedAccountParticipationOverview,
    ($selectedAccountParticipationOverview) =>
        ($selectedAccountParticipationOverview?.assemblyStakedFunds > 0 &&
            $selectedAccountParticipationOverview?.assemblyUnstakedFunds > 0) ||
        ($selectedAccountParticipationOverview?.shimmerStakedFunds > 0 &&
            $selectedAccountParticipationOverview?.shimmerUnstakedFunds > 0)
)

/**
 * The store for the total amount of funds that are partially (un)staked for
 * the selected account.
 */
export const partiallyUnstakedAmount: Readable<number> = derived(
    selectedAccountParticipationOverview,
    ($selectedAccountParticipationOverview) => {
        const assemblyPartialFunds =
            $selectedAccountParticipationOverview?.assemblyStakedFunds > 0 &&
            $selectedAccountParticipationOverview?.assemblyUnstakedFunds > 0
                ? $selectedAccountParticipationOverview?.assemblyUnstakedFunds
                : 0
        const shimmerPartialFunds =
            $selectedAccountParticipationOverview?.shimmerStakedFunds > 0 &&
            $selectedAccountParticipationOverview?.shimmerUnstakedFunds > 0
                ? $selectedAccountParticipationOverview?.shimmerUnstakedFunds
                : 0

        return Math.max(assemblyPartialFunds, shimmerPartialFunds)
    }
)

/**
 * The total accumulated Assembly rewards for all
 * accounts that have been staked at some point (even
 * if they are currently unstaked).
 *
 * Be cautious that this value is in microASMB, so it is likely to be larger.
 */
export const assemblyStakingRewards: Readable<number> = derived(
    [selectedAccountParticipationOverview],
    ([$selectedAccountParticipationOverview]) =>
        sumStakingRewards(StakingAirdrop.Assembly, $selectedAccountParticipationOverview)
)

/**
 * The total accumulated Shimmer rewards for all
 * accounts that have been staked at some point (even
 * if they are currently unstaked).
 */
export const shimmerStakingRewards: Readable<number> = derived(
    [selectedAccountParticipationOverview],
    ([$selectedAccountParticipationOverview]) =>
        sumStakingRewards(StakingAirdrop.Shimmer, $selectedAccountParticipationOverview)
)

const sumStakingRewards = (airdrop: StakingAirdrop, accountOverview: AccountParticipationOverview): number => {
    if (!accountOverview) {
        return 0
    }

    const rewardsKey = `${airdrop}Rewards`
    const rewardsBelowMinimumKey = `${airdrop}RewardsBelowMinimum`

    /**
     * NOTE: We return the sum of rewards and rewardsBelowMinimum here because it is possible that an
     * account has accumulated more than min rewards for an airdrop, but has unstaked and moved the funds
     * to another address that has NOT reach the minimum.
     */
    return accountOverview[rewardsKey] <= 0
        ? accountOverview[rewardsBelowMinimumKey]
        : accountOverview[rewardsKey] + accountOverview[rewardsBelowMinimumKey]
}
