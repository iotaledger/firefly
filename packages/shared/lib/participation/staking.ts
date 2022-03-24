import { get } from 'svelte/store'
import { getDecimalSeparator } from '../currency'
import { networkStatus } from '../networkStatus'
import { activeProfile } from '../profile'
import { getBestTimeDuration, MILLISECONDS_PER_SECOND, SECONDS_PER_MILESTONE } from '../time'
import { WalletAccount } from '../typings/wallet'
import { formatUnitBestMatch } from '../units'
import { clamp, delineateNumber } from '../utils'
import { selectedAccount } from '../wallet'
import { ASSEMBLY_EVENT_ID, SHIMMER_EVENT_ID, STAKING_AIRDROP_TOKENS, STAKING_EVENT_IDS } from './constants'
import {
    assemblyStakingRemainingTime,
    calculateRemainingStakingTime,
    participationEvents,
    selectedAccountParticipationOverview,
    shimmerStakingRemainingTime,
    stakedAccounts,
    stakingEventState,
} from './stores'
import { Participation, ParticipationEvent, ParticipationEventState, StakingAirdrop } from './types'

/**
 * Determines whether an account is currently being staked or not.
 *
 * @method isAccountStaked
 *
 * @param {string} accountId
 *
 * @returns {boolean}
 */
export const isAccountStaked = (accountId: string): boolean =>
    get(stakedAccounts).find((sa) => sa.id === accountId) !== undefined

/**
 * Determines the staking airdrop from a given participation event ID.
 *
 * @method getAirdropFromEventId
 *
 * @param {string} eventId
 *
 * @returns {StakingAirdrop}
 */
export const getAirdropFromEventId = (eventId: string): StakingAirdrop => {
    if (!eventId) {
        return
    }

    // Event ID can also belong to the other events (e.g. voting events)
    if (!STAKING_EVENT_IDS.includes(eventId)) {
        return
    }

    return eventId === ASSEMBLY_EVENT_ID ? StakingAirdrop.Assembly : StakingAirdrop.Shimmer
}

/**
 * Get the corresponding staking participation event data from its airdrop enumeration.
 *
 * @method getStakingEventFromAirdrop
 *
 * @param {StakingAirdrop} airdrop
 *
 * @returns {ParticipationEvent}
 */
export const getStakingEventFromAirdrop = (airdrop: StakingAirdrop): ParticipationEvent => {
    let stakingEventId: string
    switch (airdrop) {
        case StakingAirdrop.Assembly:
            stakingEventId = ASSEMBLY_EVENT_ID
            break
        case StakingAirdrop.Shimmer:
            stakingEventId = SHIMMER_EVENT_ID
            break
        default:
            break
    }

    return get(participationEvents).find((pe) => pe.eventId === stakingEventId)
}

/**
 * Returns a formatted version of the rewards for a particular airdrop.
 *
 * CAUTION: The formatting for the ASMB token assumes that the amount passed
 * is in microASMB.
 *
 * @method formatStakingAirdropReward
 *
 * @param {StakingAirdrop} airdrop
 * @param {number} amount
 * @param {number} decimalPlaces
 *
 * @returns {string}
 */
export const formatStakingAirdropReward = (airdrop: StakingAirdrop, amount: number, decimalPlaces: number): string => {
    const decimalSeparator = getDecimalSeparator(get(activeProfile)?.settings?.currency)
    const thousandthSeparator = decimalSeparator === '.' ? ',' : '.'

    let reward: string
    switch (airdrop) {
        case StakingAirdrop.Assembly: {
            decimalPlaces = clamp(decimalPlaces, 0, 6)

            const [integer, float] = (amount / 1_000_000).toFixed(decimalPlaces).split('.')
            reward = `${delineateNumber(integer, thousandthSeparator)}${
                Number(float) > 0 ? decimalSeparator + float : ''
            }`

            break
        }
        case StakingAirdrop.Shimmer: {
            reward = delineateNumber(String(Math.floor(amount)), thousandthSeparator)
            break
        }
        default:
            reward = '0'
            break
    }

    return `${reward} ${STAKING_AIRDROP_TOKENS[airdrop]}`
}

/**
 * Returns a formatted version of the minimum rewards for a particular airdrop.
 *
 * @method getFormattedMinimumRewards
 *
 * @param {StakingAirdrop} airdrop
 *
 * @returns {string}
 */
export const getFormattedMinimumRewards = (airdrop: StakingAirdrop): string =>
    formatStakingAirdropReward(
        airdrop,
        getStakingEventFromAirdrop(airdrop)?.information.payload.requiredMinimumRewards,
        airdrop === StakingAirdrop.Assembly ? 6 : 0
    )

/**
 * The amount of microASMB per 1 Mi received every milestone,
 * which is currently 4 microASMB (0.000004 ASMB).
 */
const ASSEMBLY_REWARD_MULTIPLIER = 4.0

/**
 * The amount of SMR per 1 Mi received every milestone,
 * which is currently 1 SMR.
 */
const SHIMMER_REWARD_MULTIPLIER = 1.0

/**
 * Calculates the reward estimate for a particular staking airdrop.
 *
 * @method estimateStakingAirdropReward
 *
 * @param {StakingAirdrop} airdrop
 * @param {number} amountToStake
 * @param {boolean} formatAmount
 * @param {number} decimalPlaces
 *
 * @returns {string}
 */
export const estimateStakingAirdropReward = (
    airdrop: StakingAirdrop,
    amountToStake: number,
    formatAmount: boolean = false,
    decimalPlaces: number = 6
): string => {
    const stakingEvent = getStakingEventFromAirdrop(airdrop)
    if (!stakingEvent || amountToStake <= 0) {
        return formatAmount ? formatStakingAirdropReward(airdrop, 0, decimalPlaces) : '0'
    }

    /**
     * NOTE: We can use either of these, however since the network status is polled reguarly
     * it will seem more dynamic rather than re-calculating within this function.
     */
    const currentMilestone = get(networkStatus)?.currentMilestone || stakingEvent?.status?.milestoneIndex
    const beginMilestone =
        currentMilestone < stakingEvent?.information?.milestoneIndexStart
            ? stakingEvent?.information?.milestoneIndexStart
            : currentMilestone
    const endMilestone = stakingEvent?.information?.milestoneIndexEnd

    const multiplier =
        airdrop === StakingAirdrop.Assembly
            ? ASSEMBLY_REWARD_MULTIPLIER
            : airdrop === StakingAirdrop.Shimmer
            ? SHIMMER_REWARD_MULTIPLIER
            : 0
    const estimation = multiplier * (amountToStake / 1_000_000) * (endMilestone - beginMilestone)

    return formatAmount ? formatStakingAirdropReward(airdrop, estimation, decimalPlaces) : estimation.toString()
}

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
 * Determines if partipations include shimmer event id
 *
 * @method isStakingForShimmer
 *
 * @param {Participation[]} participations
 *
 * @returns {boolean}
 */
export const isStakingForShimmer = (participations: Participation[]): boolean => {
    const eventIds = participations.map((participation) => participation.eventId)
    return eventIds.includes(SHIMMER_EVENT_ID)
}

/**
 * Determines if partipations include assembly event id
 *
 * @method isStakingForAssembly
 *
 * @param {Participation[]} participations
 *
 * @returns {boolean}
 */
export const isStakingForAssembly = (participations: Participation[]): boolean => {
    const eventIds = participations.map((participation) => participation.eventId)
    return eventIds.includes(ASSEMBLY_EVENT_ID)
}

/**
 * Determines whether staking is currently in the pre-stake or holding period
 *
 * @method isStakingPossible
 *
 * @param {ParticipationEventState} stakingEventState
 *
 * @returns {boolean}
 */
export const isStakingPossible = (stakingEventState: ParticipationEventState): boolean =>
    stakingEventState === ParticipationEventState.Commencing || stakingEventState === ParticipationEventState.Holding

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
    const amountStaked = get(selectedAccount)?.rawIotaBalance
    const timeRequired = calculateTimeUntilMinimumReward(rewards, airdrop, amountStaked)
    return timeRequired
}

const getNumRemainingMilestones = (airdrop: StakingAirdrop): number => {
    const event = getStakingEventFromAirdrop(airdrop)
    if (!event || !isStakingPossible(event?.status?.status)) return 0

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

const calculateIotasUntilMinimumReward = (rewards: number, airdrop: StakingAirdrop): number => {
    const minRewardsRequired = getMinimumRewardsRequired(rewards, airdrop)
    const numRemainingMilestones = getNumRemainingMilestones(airdrop)

    return minRewardsRequired / ((getAirdropRewardMultipler(airdrop) / 1_000_000) * numRemainingMilestones)
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
    const _getTimeLeft = () => {
        if (get(stakingEventState) === ParticipationEventState.Commencing) {
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
 * Returns current stake of the selected account for a given airdrop
 *
 * @method getCurrentStakeForAirdrop
 *
 * @param {StakingAirdrop} airdrop
 *
 * @returns {number}
 */
export const getCurrentStakeForAccount = (airdrop: StakingAirdrop): number => {
    const overview = get(selectedAccountParticipationOverview)
    if (!overview) {
        return 0
    }
    return airdrop === StakingAirdrop.Assembly ? overview.assemblyStakedFunds : overview.shimmerUnstakedFunds
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
