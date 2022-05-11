import { getStakingEventFromAirdrop, isAirdropAvailable } from '@lib/participation/staking'
import { activeProfile } from '@lib/profile'
import { WalletAccount } from '@lib/typings/wallet'
import { formatUnitBestMatch } from '@lib/units'
import { derived, get, Readable } from 'svelte/store'
import { MILLISECONDS_PER_SECOND, SECONDS_PER_MILESTONE } from '../time'
import { selectedAccountIdStore, selectedAccountStore } from '../wallet'
import { ASSEMBLY_REWARD_MULTIPLIER, SHIMMER_REWARD_MULTIPLIER, TREASURY_VOTE_EVENT_ID } from './constants'
import {
    assemblyStakingEventState,
    assemblyStakingRemainingTime,
    calculateRemainingStakingTime,
    participationEvents,
    participationOverview,
    shimmerStakingEventState,
    shimmerStakingRemainingTime,
} from './stores'
import { AccountParticipationOverview, ParticipationEventState, StakingAirdrop } from './types'

// TODO: This is a temporary workaround because of circular dependency
export const selectedAccountParticipationOverview = derived(
    [participationOverview, selectedAccountStore],
    ([$participationOverview, $selectedAccountStore]) =>
        $participationOverview?.find(({ accountIndex }) => accountIndex === $selectedAccountStore?.index) ?? {}
) as Readable<AccountParticipationOverview>

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

export const currentAccountTreasuryVoteValue = derived(
    [selectedAccountParticipationOverview, participationEvents],
    ([$selectedAccountParticipationOverview, $participationEvents]) => {
        const event = $participationEvents?.find((p) => p?.eventId === TREASURY_VOTE_EVENT_ID)
        if (event) {
            const participation = $selectedAccountParticipationOverview?.participations?.find(
                (participation) => participation.eventId === event.eventId
            )
            return participation?.answers[0] ?? null
        } else {
            return null
        }
    }
)

export const currentTreasuryParticipation = derived(
    selectedAccountParticipationOverview,
    ($selectedAccountParticipationOverview) => {
        const latestParticipation = $selectedAccountParticipationOverview?.trackedParticipations?.[
            TREASURY_VOTE_EVENT_ID
        ]?.reduce((max, current) => (max.startMilestoneIndex > current.startMilestoneIndex ? max : current))
        return latestParticipation?.endMilestoneIndex === 0 ? latestParticipation : null
    }
)

export const hasCurrentAccountReceivedFundsSinceLastTreasuryVote = derived(
    [selectedAccountStore, currentTreasuryParticipation],
    ([$selectedAccountStore, $currentTreasuryParticipation]) => {
        const { amount } = $currentTreasuryParticipation ?? {}
        return $selectedAccountStore && amount && amount !== $selectedAccountStore.rawIotaBalance
    }
)

/**
 * The store for the total amount of funds that are partially not voted for
 * the selected account.
 */
export const currentAccountTreasuryVotePartiallyUnvotedAmount = derived(
    [selectedAccountStore, currentTreasuryParticipation],
    ([$selectedAccountStore, $currentTreasuryParticipation]) => {
        const { amount } = $currentTreasuryParticipation ?? {}
        const accountBalance = $selectedAccountStore?.rawIotaBalance ?? 0
        return amount < accountBalance ? accountBalance - amount : 0
    }
)

function getCurrentStakingRewards(airdrop: StakingAirdrop, accountOverview: AccountParticipationOverview): number {
    if (!airdrop || !isAirdropAvailable(airdrop) || !accountOverview) {
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

function getCachedStakingRewards(airdrop: StakingAirdrop, accountId: string): number {
    if (!airdrop || !accountId) return 0

    const stakingRewards = get(activeProfile)?.stakingRewards
    if (!stakingRewards) return 0

    const accountStakingRewards = stakingRewards.find((_stakingRewards) => _stakingRewards.accountId === accountId)
    if (!accountStakingRewards) return 0

    return accountStakingRewards[airdrop]?.totalAirdropRewards || 0
}

/**
 * The current accumulated Assembly rewards for the selected
 * account that have been staked at some point (even
 * if they are currently unstaked) in the current staking period.
 *
 * Be cautious that this value is in microASMB, so it is likely to be larger.
 */
export const currentAssemblyStakingRewards: Readable<number> = derived(
    [selectedAccountParticipationOverview],
    ([$selectedAccountParticipationOverview]) =>
        getCurrentStakingRewards(StakingAirdrop.Assembly, $selectedAccountParticipationOverview)
)

/**
 * The current accumulated Assembly rewards for the selected account
 * that are below the minimum rewards requirement.
 */
export const currentAssemblyStakingRewardsBelowMinimum: Readable<number> = derived(
    [selectedAccountParticipationOverview],
    ([$selectedAccountParticipationOverview]) =>
        getCurrentStakingRewards(StakingAirdrop.Assembly, $selectedAccountParticipationOverview) -
        ($selectedAccountParticipationOverview?.assemblyRewards ?? 0)
)

/**
 * The total accumulated Assembly rewards for the selected account.
 */
export const totalAssemblyStakingRewards: Readable<number> = derived(
    [currentAssemblyStakingRewards, selectedAccountIdStore],
    ([$currentAssemblyStakingRewards, $selectedAccountId]) =>
        $currentAssemblyStakingRewards + getCachedStakingRewards(StakingAirdrop.Assembly, $selectedAccountId)
)

/**
 * The current accumulated Shimmer rewards for the selected
 * account that have been staked at some point (even
 * if they are currently unstaked) in the current staking period.
 */
export const currentShimmerStakingRewards: Readable<number> = derived(
    [selectedAccountParticipationOverview],
    ([$selectedAccountParticipationOverview]) =>
        getCurrentStakingRewards(StakingAirdrop.Shimmer, $selectedAccountParticipationOverview)
)

/**
 * The current accumulated Shimmer rewards for the selected account
 * that are below the minimum rewards requirement.
 */
export const currentShimmerStakingRewardsBelowMinimum: Readable<number> = derived(
    [selectedAccountParticipationOverview],
    ([$selectedAccountParticipationOverview]) =>
        getCurrentStakingRewards(StakingAirdrop.Shimmer, $selectedAccountParticipationOverview) -
        ($selectedAccountParticipationOverview?.shimmerRewards ?? 0)
)

/**
 * The total accumulated Shimmer rewards for the selected account.
 */
export const totalShimmerStakingRewards: Readable<number> = derived(
    [currentShimmerStakingRewards, selectedAccountIdStore],
    ([$currentShimmerStakingRewards, $selectedAccountId]) =>
        $currentShimmerStakingRewards + getCachedStakingRewards(StakingAirdrop.Shimmer, $selectedAccountId)
)

/**
 * Calculate the staked funds for the selected account.
 *
 * @method getStakedFunds
 *
 * @returns {number}
 */
export const getStakedFunds = (): number => {
    const accountParticipation = get(selectedAccountParticipationOverview)
    if (!accountParticipation) {
        return 0
    }
    return Math.max(accountParticipation.assemblyStakedFunds, accountParticipation.shimmerStakedFunds)
}

/**
 * Calculate the unstaked funds for the selected account.
 *
 * @method getUnstakedFunds
 *
 * @returns {number}
 */
export const getUnstakedFunds = (): number => {
    const accountParticipation = get(selectedAccountParticipationOverview)
    if (!accountParticipation) {
        return 0
    }
    return Math.min(accountParticipation.assemblyUnstakedFunds, accountParticipation.shimmerUnstakedFunds)
}

/**
 * Returns current rewards of the selected account for a given airdrop
 *
 * @method getCurrentRewardsForAirdrop
 *
 * @param {StakingAirdrop} airdrop
 *
 * @returns {number}
 */
export const getCurrentRewardsForAirdrop = (airdrop: StakingAirdrop): number => {
    const overview = get(selectedAccountParticipationOverview)
    if (!overview) {
        return 0
    }

    return airdrop === StakingAirdrop.Assembly
        ? overview.assemblyRewards + overview.assemblyRewardsBelowMinimum
        : overview.shimmerRewards + overview.shimmerRewardsBelowMinimum
}

/**
 * Determines whether the selected account has reached the reward minimum
 * for either airdrop.
 *
 * @method hasAccountReachedMinimumAirdrop
 * *
 * @returns {boolean}
 */
export const hasAccountReachedMinimumAirdrop = (): boolean => {
    const overview = get(selectedAccountParticipationOverview)
    if (!overview) {
        return false
    }

    return overview.assemblyRewards > 0 || overview.shimmerRewards > 0
}

/**
 * Calculates the remaining number of IOTAs needed to reach the minimum airdrop amount.
 * If called with format = true then returns best unit match for amount of IOTAs, else
 * returns the raw number of IOTAs.
 *
 * @method getIotasUntilMinimumAirdropReward
 *
 * @param {WalletAccount} account
 * @param {StakingAirdrop} airdrop
 * @param {boolean} format
 *
 * @returns {string}
 */
export const getIotasUntilMinimumAirdropReward = (
    account: WalletAccount,
    airdrop: StakingAirdrop,
    format: boolean = false
): string => {
    if (!account) {
        return format ? formatUnitBestMatch(0) : '0'
    }

    const currentRewards = getCurrentRewardsForAirdrop(airdrop)
    const iotasRequired = Math.round(calculateIotasUntilMinimumReward(currentRewards, airdrop))

    return format ? formatUnitBestMatch(iotasRequired) : iotasRequired.toString()
}

/**
 * Determines whether an account will be able to reach rewards minimums
 * for both airdrops. This will return false if only one airdrop's minimum
 * is able to be reached.
 *
 * @method canAccountReachMinimumAirdrop
 *
 * @param {WalletAccount} account
 * @param {StakingAirdrop} airdrop
 *
 * @returns {boolean}
 */
export const canAccountReachMinimumAirdrop = (account: WalletAccount, airdrop: StakingAirdrop): boolean => {
    if (!account) {
        return false
    }

    const currentRewards = getCurrentRewardsForAirdrop(airdrop)
    const timeRequired = calculateTimeUntilMinimumReward(currentRewards, airdrop, account.rawIotaBalance)
    const stakingEvent = getStakingEventFromAirdrop(airdrop)
    const stakingEventStore = airdrop === StakingAirdrop.Assembly ? assemblyStakingEventState : shimmerStakingEventState
    const stakingEventState = get(stakingEventStore)
    const _getTimeLeft = () => {
        if (stakingEventState === ParticipationEventState.Commencing) {
            return calculateRemainingStakingTime(stakingEvent?.information?.milestoneIndexStart, stakingEvent)
        }
        return airdrop === StakingAirdrop.Assembly
            ? get(assemblyStakingRemainingTime)
            : airdrop === StakingAirdrop.Shimmer
            ? get(shimmerStakingRemainingTime)
            : 0
    }

    return timeRequired <= _getTimeLeft()
}

/**
 * Calculates the remaining time needed to continue staking in order to
 * reach the minimum airdrop amount for the selected account.
 * If called with format = true then returns
 * human-readable duration, else returns the amount of time in millis.
 *
 * @method getTimeUntilMinimumAirdropReward
 *
 * @param {StakingAirdrop} airdrop
 *
 * @returns {number}
 */
export const getTimeUntilMinimumAirdropReward = (airdrop: StakingAirdrop): number => {
    const rewards = getCurrentRewardsForAirdrop(airdrop)
    const amountStaked = get(selectedAccountStore)?.rawIotaBalance
    return calculateTimeUntilMinimumReward(rewards, airdrop, amountStaked)
}

const calculateIotasUntilMinimumReward = (rewards: number, airdrop: StakingAirdrop): number => {
    const minRewardsRequired = getMinimumRewardsRequired(rewards, airdrop)
    const numRemainingMilestones = getNumRemainingMilestones(airdrop)

    return minRewardsRequired / ((getAirdropRewardMultipler(airdrop) / 1_000_000) * numRemainingMilestones)
}

const getAirdropRewardMultipler = (airdrop: StakingAirdrop): number =>
    airdrop === StakingAirdrop.Assembly
        ? ASSEMBLY_REWARD_MULTIPLIER
        : airdrop === StakingAirdrop.Shimmer
        ? SHIMMER_REWARD_MULTIPLIER
        : 0

const calculateNumMilestonesUntilMinimumReward = (
    rewardsNeeded: number,
    airdrop: StakingAirdrop,
    amountStaked: number
): number => {
    const result = (rewardsNeeded * 1_000_000) / (amountStaked * getAirdropRewardMultipler(airdrop))
    return isNaN(result) ? 0 : result
}

const getMinimumRewardsRequired = (rewards: number, airdrop: StakingAirdrop): number => {
    const event = getStakingEventFromAirdrop(airdrop)
    if (!event) {
        return 0
    }

    const rewardsRequired = event.information.payload.requiredMinimumRewards
    if (rewards >= rewardsRequired) {
        return 0
    }
    return rewardsRequired - rewards
}

const calculateTimeUntilMinimumReward = (rewards: number, airdrop: StakingAirdrop, amountStaked: number): number => {
    const minRewardsRequired = getMinimumRewardsRequired(rewards, airdrop)
    const numMilestonesUntilMinimumReward = calculateNumMilestonesUntilMinimumReward(
        minRewardsRequired,
        airdrop,
        amountStaked
    )

    return numMilestonesUntilMinimumReward * SECONDS_PER_MILESTONE * MILLISECONDS_PER_SECOND
}

const getNumRemainingMilestones = (airdrop: StakingAirdrop): number => {
    const event = getStakingEventFromAirdrop(airdrop)
    if (!event || !isParticipationPossible(event?.status?.status)) return 0

    // Remaining time is in milliseconds
    const timeLeft =
        airdrop === StakingAirdrop.Assembly
            ? get(assemblyStakingRemainingTime)
            : airdrop === StakingAirdrop.Shimmer
            ? get(shimmerStakingRemainingTime)
            : 0

    const isInHolding = event?.status?.status === ParticipationEventState.Holding
    const { milestoneIndexStart, milestoneIndexEnd } = event?.information

    return isInHolding
        ? timeLeft / MILLISECONDS_PER_SECOND / SECONDS_PER_MILESTONE
        : milestoneIndexEnd - milestoneIndexStart
}

/**
 * Determines whether is possible to participate in an event
 *
 * @method isParticipationPossible
 *
 * @param {ParticipationEventState} stakingEventState
 *
 * @returns {boolean}
 */
export const isParticipationPossible = (eventState: ParticipationEventState): boolean =>
    eventState === ParticipationEventState.Commencing || eventState === ParticipationEventState.Holding

export function isNewStakingEvent(stakingEventState: ParticipationEventState): boolean {
    if (!stakingEventState) return false

    return (
        stakingEventState === ParticipationEventState.Upcoming ||
        stakingEventState === ParticipationEventState.Commencing
    )
}
