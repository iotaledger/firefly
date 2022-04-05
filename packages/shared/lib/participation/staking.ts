import { get } from 'svelte/store'

import { Bech32 } from '@lib/bech32'

import { getDecimalSeparator } from '../currency'
import { networkStatus } from '../networkStatus'
import { activeProfile, updateProfile } from '../profile'
import { MILLISECONDS_PER_SECOND, SECONDS_PER_MILESTONE } from '../time'
import { WalletAccount } from '../typings/wallet'
import { formatUnitBestMatch } from '../units'
import { clamp, delineateNumber, getJsonRequestOptions, range, toHexString } from '../utils'
import { selectedAccount, wallet } from '../wallet'

import {
    ASSEMBLY_EVENT_ID,
    ASSEMBLY_STAKING_RESULT_URLS,
    LAST_ASSEMBLY_STAKING_PERIOD,
    LAST_SHIMMER_STAKING_PERIOD,
    SHIMMER_EVENT_ID,
    SHIMMER_STAKING_RESULT_URLS,
    STAKING_AIRDROP_TOKENS,
    STAKING_EVENT_IDS,
} from './constants'
import {
    assemblyStakingRemainingTime,
    calculateRemainingStakingTime,
    participationEvents,
    selectedAccountParticipationOverview,
    shimmerStakingRemainingTime,
    stakedAccounts,
    stakingEventState,
} from './stores'
import {
    AccountStakingRewards,
    AirdropStakingRewards,
    Participation,
    ParticipationEvent,
    ParticipationEventState,
    StakingAirdrop,
    StakingPeriod,
    StakingPeriodResult,
    StakingPeriodRewards,
} from './types'

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

function isValidPeriodNumber(airdrop: StakingAirdrop, periodNumber: number): boolean {
    if (!airdrop || periodNumber < 1) return false

    switch (airdrop) {
        case StakingAirdrop.Assembly:
            return periodNumber <= LAST_ASSEMBLY_STAKING_PERIOD
        case StakingAirdrop.Shimmer:
            return periodNumber <= LAST_SHIMMER_STAKING_PERIOD
        default:
            return false
    }
}

function getStakingResultUrl(airdrop: StakingAirdrop, periodNumber: number): string {
    switch (airdrop) {
        case StakingAirdrop.Assembly:
            return ASSEMBLY_STAKING_RESULT_URLS[periodNumber - 1] ?? ''
        case StakingAirdrop.Shimmer:
            return SHIMMER_STAKING_RESULT_URLS[periodNumber - 1] ?? ''
        default:
            return ''
    }
}

async function fetchStakingResult(airdrop: StakingAirdrop, periodNumber: number): Promise<StakingPeriodResult> {
    const stakingResultUrl = getStakingResultUrl(airdrop, periodNumber)
    const stakingResultResponse = await fetch(stakingResultUrl, getJsonRequestOptions())

    return stakingResultResponse.json()
}

function getCurrentStakingRewards(): AccountStakingRewards[] {
    const currentStakingRewards = get(activeProfile)?.stakingRewards ?? []
    if (currentStakingRewards.length === 0) {
        return get(get(wallet).accounts).map((account) => ({ accountId: account.id }))
    } else {
        return currentStakingRewards
    }
}

function getEd25519AddressesOfAccount(account: WalletAccount): string[] {
    if (!account) return []

    return account.addresses.map((bech32Address) => toHexString(Array.from(Bech32.decode(bech32Address.address).data)))
}

function getStakingPeriodForAccount(
    account: WalletAccount,
    stakingResult: StakingPeriodResult,
    periodNumber: number
): StakingPeriod {
    const ed25519Addresses = getEd25519AddressesOfAccount(account)

    // REMOVE AFTER DEV
    if (account.id === 'wallet-account://991aee8ce7da90bbfdd7b277fe16ee70e69f5c9359fff830547dc14e93a8f5fb') {
        ed25519Addresses.push(
            periodNumber <= 1
                ? '000f4afd9fa93e1910307c885a6108dd5bddabad10fb436788dd0bfb5d0b6ba6'
                : '8b204cf311367f8b6458a3373a89075ac3833dd9e77e2d61b9ffb479a5719ca8'
        )
    }

    const ed25519AddressesWithRewards = ed25519Addresses
        .filter((address) => address in stakingResult.rewards)
        .map((address) => [address, stakingResult.rewards[address]])

    const totalPeriodRewards = ed25519AddressesWithRewards.reduce(
        (sum: number, current: [string, number]) => sum + current[1],
        0
    )
    const rewards: StakingPeriodRewards = Object.fromEntries(ed25519AddressesWithRewards)

    return {
        periodNumber,
        totalPeriodRewards,
        rewards,
    }
}

function getAirdropStakingRewards(
    currentAccountStakingRewards: AccountStakingRewards,
    airdrop: StakingAirdrop,
    period: StakingPeriod
): AirdropStakingRewards {
    const airdropStakingRewards: AirdropStakingRewards = currentAccountStakingRewards[airdrop] ?? {
        totalAirdropRewards: 0,
        periods: [],
    }
    const currentPeriodIndex = airdropStakingRewards.periods.findIndex((p) => p.periodNumber === period.periodNumber)
    if (currentPeriodIndex === -1) {
        airdropStakingRewards.periods.push(period)
    } else {
        airdropStakingRewards.periods[currentPeriodIndex] = period
    }

    airdropStakingRewards.totalAirdropRewards = airdropStakingRewards.periods.reduce(
        (sum: number, current: StakingPeriod) => sum + current.totalPeriodRewards,
        0
    )

    return airdropStakingRewards
}

function updateStakingRewardsForAccount(
    currentAccountStakingRewards: AccountStakingRewards,
    stakingResult: StakingPeriodResult,
    airdrop: StakingAirdrop,
    periodNumber: number
): AccountStakingRewards {
    const account = get(get(wallet).accounts).find((acc) => acc.id === currentAccountStakingRewards.accountId)
    if (!account) return currentAccountStakingRewards

    const period = getStakingPeriodForAccount(account, stakingResult, periodNumber)
    const airdropStakingRewards = getAirdropStakingRewards(currentAccountStakingRewards, airdrop, period)

    return { ...currentAccountStakingRewards, [airdrop]: airdropStakingRewards }
}

/**
 * Caches the result of a single staking period for a given airdrop and period number.
 */
export async function cacheStakingPeriod(airdrop: StakingAirdrop, periodNumber: number): Promise<void> {
    if (!airdrop || !isValidPeriodNumber(airdrop, periodNumber)) return

    const stakingResult = await fetchStakingResult(airdrop, periodNumber)
    const currentStakingRewards = getCurrentStakingRewards()
    const updatedStakingRewards: AccountStakingRewards[] = currentStakingRewards.map(
        (accountStakingRewards: AccountStakingRewards) =>
            updateStakingRewardsForAccount(accountStakingRewards, stakingResult, airdrop, periodNumber)
    )

    updateProfile('stakingRewards', updatedStakingRewards)
}

function getLastStakingPeriodNumber(airdrop: StakingAirdrop): number {
    switch (airdrop) {
        case StakingAirdrop.Assembly:
            return LAST_ASSEMBLY_STAKING_PERIOD
        case StakingAirdrop.Shimmer:
            return LAST_SHIMMER_STAKING_PERIOD
        default:
            return 0
    }
}

/**
 * Caches the results of the last staking period for a given airdrop.
 */
export async function cacheLastStakingPeriod(airdrop: StakingAirdrop): Promise<void> {
    const periodNumber = getLastStakingPeriodNumber(airdrop)
    if (periodNumber <= 0) return

    await cacheStakingPeriod(airdrop, periodNumber)
}

/**
 * Caches the results for some of the staking periods for a given airdrop and array of period numbers.
 */
export async function cacheSomeStakingPeriods(airdrop: StakingAirdrop, periodNumbers: number[]): Promise<void> {
    await Promise.all(periodNumbers.map((periodNumber) => cacheStakingPeriod(airdrop, periodNumber)))
}

/**
 * Caches the results of all staking periods for a given airdrop.
 */
export async function cacheAllStakingPeriods(airdrop: StakingAirdrop): Promise<void> {
    const numberOfPeriods = getLastStakingPeriodNumber(airdrop)
    await cacheSomeStakingPeriods(airdrop, range(numberOfPeriods, 1))
}

function getUncachedStakingPeriodNumbers(airdrop: StakingAirdrop): number[] {
    const stakingRewards = get(activeProfile)?.stakingRewards ?? []
    if (stakingRewards.length === 0) {
        return range(getLastStakingPeriodNumber(airdrop), 1)
    } else {
        const stakingPeriodNumbers = range(getLastStakingPeriodNumber(airdrop), 1)

        const uncachedStakingPeriodNumbers = []
        stakingRewards.forEach((stakingRewards) => {
            const airdropStakingRewards = stakingRewards[airdrop]
            if (!airdropStakingRewards) {
                return range(getLastStakingPeriodNumber(airdrop), 1)
            } else {
                stakingPeriodNumbers.forEach((stakingPeriodNumber) => {
                    if (!airdropStakingRewards.periods.some((period) => period.periodNumber === stakingPeriodNumber)) {
                        if (!uncachedStakingPeriodNumbers.includes(stakingPeriodNumber)) {
                            uncachedStakingPeriodNumbers.push(stakingPeriodNumber)
                        }
                    }
                })
            }
        })

        return uncachedStakingPeriodNumbers
    }
}

export async function updateStakingPeriodCache(): Promise<void> {
    const uncachedAssemblyPeriodNumbers = getUncachedStakingPeriodNumbers(StakingAirdrop.Assembly)
    await Promise.all(
        uncachedAssemblyPeriodNumbers.map((uncachedAssemblyPeriodNumber) =>
            cacheStakingPeriod(StakingAirdrop.Assembly, uncachedAssemblyPeriodNumber)
        )
    )

    const uncachedShimmerPeriodNumbers = getUncachedStakingPeriodNumbers(StakingAirdrop.Shimmer)
    await Promise.all(
        uncachedShimmerPeriodNumbers.map((uncachedShimmerPeriodNumber) =>
            cacheStakingPeriod(StakingAirdrop.Assembly, uncachedShimmerPeriodNumber)
        )
    )
}
