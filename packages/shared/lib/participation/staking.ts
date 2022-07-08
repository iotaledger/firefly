import { IAccountState, selectedAccount } from '@core/account'
import { networkStatus } from '@core/network'
import { activeProfile } from '@core/profile'
import { get } from 'svelte/store'
import { getDecimalSeparator } from '../currency'
import { MILLISECONDS_PER_SECOND, SECONDS_PER_MILESTONE } from '../time'
import { formatUnitBestMatch } from '../units'
import { clamp, delineateNumber, getJsonRequestOptions, range } from '../utils'
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
    assemblyStakingEventState,
    assemblyStakingRemainingTime,
    calculateRemainingStakingTime,
    participationEvents,
    selectedAccountParticipationOverview,
    shimmerStakingEventState,
    shimmerStakingRemainingTime,
    stakedAccounts,
} from './stores'
import {
    Participation,
    ParticipationEvent,
    ParticipationEventState,
    StakingAirdrop,
    StakingPeriodJsonResponse,
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

export function getStakingEventIdFromAirdrop(airdrop: StakingAirdrop): string {
    if (!airdrop) return ''

    switch (airdrop) {
        case StakingAirdrop.Assembly:
            return ASSEMBLY_EVENT_ID
        case StakingAirdrop.Shimmer:
            return SHIMMER_EVENT_ID
        default:
            return ''
    }
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
    const stakingEventId = getStakingEventIdFromAirdrop(airdrop)
    return get(participationEvents).find((pe) => pe.eventId === stakingEventId)
}

export function getAvailableAirdrops(): StakingAirdrop[] {
    return STAKING_EVENT_IDS.filter((id) => id).map((id) => getAirdropFromEventId(id))
}

export function isAirdropAvailable(airdrop: StakingAirdrop): boolean {
    if (!airdrop) return false
    return getAvailableAirdrops().includes(airdrop)
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
 * which is currently 2 microASMB (0.000002 ASMB).
 */
const ASSEMBLY_REWARD_MULTIPLIER = 2.0

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
    const amountStaked = get(selectedAccount)?.balances.baseCoin.available
    return calculateTimeUntilMinimumReward(rewards, airdrop, Number(amountStaked))
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
 * @param {IAccountState} account
 * @param {StakingAirdrop} airdrop
 * @param {boolean} format
 *
 * @returns {string}
 */
export const getIotasUntilMinimumAirdropReward = (
    account: IAccountState,
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
 * @param {IAccountState} account
 * @param {StakingAirdrop} airdrop
 *
 * @returns {boolean}
 */
export const canAccountReachMinimumAirdrop = (account: IAccountState, airdrop: StakingAirdrop): boolean => {
    if (!account) {
        return false
    }

    const currentRewards = getCurrentRewardsForAirdrop(airdrop)
    const timeRequired = calculateTimeUntilMinimumReward(
        currentRewards,
        airdrop,
        Number(account.balances.baseCoin.available)
    )
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

export function isNewStakingEvent(stakingEventState: ParticipationEventState): boolean {
    if (!stakingEventState) return false

    return (
        stakingEventState === ParticipationEventState.Upcoming ||
        stakingEventState === ParticipationEventState.Commencing
    )
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
    if (!airdrop || !isValidPeriodNumber(airdrop, periodNumber)) return ''

    switch (airdrop) {
        case StakingAirdrop.Assembly:
            return ASSEMBLY_STAKING_RESULT_URLS[periodNumber - 1] ?? ''
        case StakingAirdrop.Shimmer:
            return SHIMMER_STAKING_RESULT_URLS[periodNumber - 1] ?? ''
        default:
            return ''
    }
}

async function fetchStakingResult(
    airdrop: StakingAirdrop,
    periodNumber: number
): Promise<StakingPeriodJsonResponse> | undefined {
    const stakingResultUrl = getStakingResultUrl(airdrop, periodNumber)

    try {
        const stakingResultResponse = await fetch(stakingResultUrl, getJsonRequestOptions())

        return stakingResultResponse.json()
    } catch (err) {
        console.error(`Unable to fetch staking results from ${stakingResultUrl}`)
    }
}

// function getAccountStakingRewards(): AccountStakingRewards[] {
//     const cachedStakingRewards = get(activeProfile)?.stakingRewards ?? []
//     if (cachedStakingRewards.length === 0) {
//         return get(get(activeProfile).accounts).map((account) => ({ accountId: account.id }))
//     } else {
//         return cachedStakingRewards
//     }
// }

// function getStakingPeriodForAccount(
//     account: IAccountState,
//     stakingResult: StakingPeriodJsonResponse,
//     periodNumber: number
// ): StakingPeriod {
//     const ed25519Addresses = account.addresses.map((address) => convertBech32AddressToEd25519Address(address.address))

//     let totalPeriodRewards = 0

//     const ed25519AddressesWithRewards = ed25519Addresses
//         .filter((address) => address in stakingResult.rewards)
//         .map((address) => {
//             totalPeriodRewards += stakingResult.rewards[address]

//             return [address, stakingResult.rewards[address]]
//         })
//     const rewards: StakingPeriodRewards = Object.fromEntries(ed25519AddressesWithRewards)

//     return {
//         periodNumber,
//         totalPeriodRewards,
//         rewards,
//     }
// }

// function getAirdropStakingRewards(
//     previousAccountStakingRewards: AccountStakingRewards,
//     airdrop: StakingAirdrop,
//     period: StakingPeriod
// ): AirdropStakingRewards {
//     const airdropStakingRewards: AirdropStakingRewards = previousAccountStakingRewards[airdrop] ?? {
//         totalAirdropRewards: 0,
//         periods: [],
//     }
//     const periodIndex = airdropStakingRewards.periods.findIndex((p) => p.periodNumber === period.periodNumber)
//     if (periodIndex === -1) {
//         airdropStakingRewards.periods.push(period)
//     } else {
//         airdropStakingRewards.periods[periodIndex] = period
//     }

//     airdropStakingRewards.totalAirdropRewards = airdropStakingRewards.periods.reduce(
//         (sum: number, current: StakingPeriod) => sum + current.totalPeriodRewards,
//         0
//     )

//     return airdropStakingRewards
// }

/**
 * Caches the result of a single staking period for a given airdrop and period number.
 */
export async function cacheStakingPeriod(airdrop: StakingAirdrop, periodNumber: number): Promise<void> {
    if (!airdrop || !isValidPeriodNumber(airdrop, periodNumber)) return

    const stakingResult = await fetchStakingResult(airdrop, periodNumber)
    if (!stakingResult) return

    // const previousStakingRewards = getAccountStakingRewards()
    // const updatedStakingRewards: AccountStakingRewards[] = previousStakingRewards.map(
    //     (accountStakingRewards: AccountStakingRewards) =>
    //         updateStakingRewardsForAccount(accountStakingRewards, stakingResult, airdrop, periodNumber)
    // )

    // updateProfile('stakingRewards', updatedStakingRewards)
}

// function updateStakingRewardsForAccount(
//     previousAccountStakingRewards: AccountStakingRewards,
//     stakingResult: StakingPeriodJsonResponse,
//     airdrop: StakingAirdrop,
//     periodNumber: number
// ): AccountStakingRewards {
//     const account = get(activeAccounts).find((acc) => acc.id === previousAccountStakingRewards.accountId)
//     if (!account) return previousAccountStakingRewards

//     const period = getStakingPeriodForAccount(account, stakingResult, periodNumber)
//     const airdropStakingRewards = getAirdropStakingRewards(previousAccountStakingRewards, airdrop, period)

//     return { ...previousAccountStakingRewards, [airdrop]: airdropStakingRewards }
// }

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getUncachedStakingPeriodNumbers(airdrop: StakingAirdrop): number[] {
    // const stakingRewards = get(activeProfile)?.stakingRewards ?? []
    // if (stakingRewards.length === 0) {
    //     return range(getLastStakingPeriodNumber(airdrop), 1)
    // } else {
    //     const stakingPeriodNumbers = range(getLastStakingPeriodNumber(airdrop), 1)

    //     let shouldBreak = false
    //     let uncachedStakingPeriodNumbers = []
    //     stakingRewards.forEach((stakingReward) => {
    //         if (shouldBreak) return

    //         const airdropStakingRewards = stakingReward[airdrop]
    //         if (!airdropStakingRewards) {
    //             uncachedStakingPeriodNumbers = range(getLastStakingPeriodNumber(airdrop), 1)
    //             shouldBreak = true
    //         } else {
    //             stakingPeriodNumbers.forEach((stakingPeriodNumber) => {
    //                 if (!airdropStakingRewards.periods.some((period) => period.periodNumber === stakingPeriodNumber)) {
    //                     if (!uncachedStakingPeriodNumbers.includes(stakingPeriodNumber)) {
    //                         uncachedStakingPeriodNumbers.push(stakingPeriodNumber)
    //                     }
    //                 }
    //             })
    //         }
    //     })

    //     return uncachedStakingPeriodNumbers
    // }
    return [1, 2, 3, 4, 5, 6, 7]
}

async function updateStakingPeriodCacheForAirdrop(airdrop: StakingAirdrop): Promise<void> {
    if (!airdrop) return

    const uncachedPeriodNumbers = getUncachedStakingPeriodNumbers(airdrop)
    await Promise.all(
        uncachedPeriodNumbers.map((uncachedPeriodNumber) => cacheStakingPeriod(airdrop, uncachedPeriodNumber))
    )
}

/**
 * Updates the staking period caches for both Assembly and Shimmer airdrops,
 * first checking if they need to be updated.
 */
export async function updateStakingPeriodCache(): Promise<void> {
    await updateStakingPeriodCacheForAirdrop(StakingAirdrop.Assembly)
    await updateStakingPeriodCacheForAirdrop(StakingAirdrop.Shimmer)
}
