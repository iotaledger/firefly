import { localize } from '@core/i18n'
import { convertBech32AddressToEd25519Address } from '@lib/ed25519'
import { showAppNotification } from '@lib/notifications'
import { addError } from 'shared/lib/errors'
import { get, writable } from 'svelte/store'
import { getDecimalSeparator } from '../currency'
import { networkStatus } from '../networkStatus'
import { activeProfile, updateProfile } from '../profile'
import { WalletAccount } from '../typings/wallet'
import { clamp, delineateNumber, getJsonRequestOptions, range } from '../utils'
import { wallet } from '../wallet'
import {
    ASSEMBLY_EVENT_ID,
    ASSEMBLY_REWARD_MULTIPLIER,
    ASSEMBLY_STAKING_RESULT_FILES,
    BACKUP_STAKING_RESULT_URL,
    LAST_ASSEMBLY_STAKING_PERIOD,
    LAST_SHIMMER_STAKING_PERIOD,
    SHIMMER_EVENT_ID,
    SHIMMER_REWARD_MULTIPLIER,
    SHIMMER_STAKING_RESULT_FILES,
    STAKING_AIRDROP_TOKENS,
    STAKING_EVENT_IDS,
    LOCAL_STAKING_RESULT_URL,
} from './constants'
import { participationEvents, stakedAccounts } from './stores'
import {
    AccountStakingRewards,
    AirdropStakingRewards,
    Participation,
    ParticipationEvent,
    StakingAirdrop,
    StakingPeriod,
    StakingPeriodJsonResponse,
    StakingPeriodRewards,
} from './types'
import { Platform } from '@lib/platform'

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
    if (!amount) {
        amount = 0
    }

    if (!decimalPlaces) {
        decimalPlaces = 0
    }

    const decimalSeparator = getDecimalSeparator(get(activeProfile)?.settings?.currency)
    const thousandthSeparator = decimalSeparator === '.' ? ',' : '.'

    decimalPlaces = clamp(decimalPlaces, 0, 6)

    const [integer, float] = (amount / 1_000_000).toFixed(decimalPlaces).split('.')

    let reward: string
    const shouldModifyForGlowUnits = Number(integer) <= 0 && Number(float) > 0 && airdrop === StakingAirdrop.Shimmer
    if (shouldModifyForGlowUnits) {
        reward = `${delineateNumber(float, thousandthSeparator)}` ?? '0'
        return `${reward} glow`
    } else {
        reward =
            `${delineateNumber(integer, thousandthSeparator)}${Number(float) > 0 ? decimalSeparator + float : ''}` ??
            '0'
        return `${reward} ${STAKING_AIRDROP_TOKENS[airdrop]}`
    }
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

function getStakingResultFileName(airdrop: StakingAirdrop, periodNumber: number): string {
    if (!airdrop || !isValidPeriodNumber(airdrop, periodNumber)) return ''

    switch (airdrop) {
        case StakingAirdrop.Assembly:
            return ASSEMBLY_STAKING_RESULT_FILES[periodNumber - 1] ?? ''
        case StakingAirdrop.Shimmer:
            return SHIMMER_STAKING_RESULT_FILES[periodNumber - 1] ?? ''
        default:
            return ''
    }
}

async function fetchStakingResult(
    airdrop: StakingAirdrop,
    periodNumber: number
): Promise<StakingPeriodJsonResponse> | undefined {
    const stakingResultFileName = getStakingResultFileName(airdrop, periodNumber)

    try {
        return (await Platform.loadJsonFile(
            LOCAL_STAKING_RESULT_URL + stakingResultFileName
        )) as StakingPeriodJsonResponse
    } catch (err) {
        try {
            const backupStakingResultResponse = await fetch(
                BACKUP_STAKING_RESULT_URL + stakingResultFileName,
                getJsonRequestOptions()
            )
            return await backupStakingResultResponse.json()
        } catch (_err) {
            console.error(`Unable to fetch staking results for ${stakingResultFileName}`)
            addError({
                time: Date.now(),
                type: 'Network',
                message: `Failed to fetch staking result for '${stakingResultFileName}'`,
            })
            showAppNotification({
                type: 'error',
                message: localize('error.participation.failedToFetchPreviousRewards'),
            })
        }
    }
}

function getStakingPeriodForAccount(
    account: WalletAccount,
    stakingResult: StakingPeriodJsonResponse,
    periodNumber: number
): StakingPeriod {
    const ed25519Addresses = account.addresses.map((address) => convertBech32AddressToEd25519Address(address.address))

    let totalPeriodRewards = 0

    const ed25519AddressesWithRewards = ed25519Addresses
        .filter((address) => address in stakingResult.rewards)
        .map((address) => {
            totalPeriodRewards += stakingResult.rewards[address]

            return [address, stakingResult.rewards[address]]
        })
    const rewards: StakingPeriodRewards = Object.fromEntries(ed25519AddressesWithRewards)

    return {
        periodNumber,
        totalPeriodRewards,
        rewards,
    }
}

function getAirdropStakingRewards(
    previousAccountStakingRewards: AccountStakingRewards,
    airdrop: StakingAirdrop,
    period: StakingPeriod
): AirdropStakingRewards {
    const airdropStakingRewards: AirdropStakingRewards = previousAccountStakingRewards[airdrop] ?? {
        totalAirdropRewards: 0,
        periods: [],
    }
    const periodIndex = airdropStakingRewards.periods.findIndex((p) => p.periodNumber === period.periodNumber)
    if (periodIndex === -1) {
        airdropStakingRewards.periods.push(period)
    } else {
        airdropStakingRewards.periods[periodIndex] = period
    }

    airdropStakingRewards.totalAirdropRewards = airdropStakingRewards.periods.reduce(
        (sum: number, current: StakingPeriod) => sum + current.totalPeriodRewards,
        0
    )

    return airdropStakingRewards
}

function updateStakingRewardsForAccount(
    previousAccountStakingRewards: AccountStakingRewards,
    stakingResult: StakingPeriodJsonResponse,
    airdrop: StakingAirdrop,
    periodNumber: number
): AccountStakingRewards {
    const account = get(get(wallet).accounts).find((acc) => acc.id === previousAccountStakingRewards.accountId)
    if (!account) return previousAccountStakingRewards

    const period = getStakingPeriodForAccount(account, stakingResult, periodNumber)
    const airdropStakingRewards = getAirdropStakingRewards(previousAccountStakingRewards, airdrop, period)

    return { ...previousAccountStakingRewards, [airdrop]: airdropStakingRewards }
}

/**
 * Caches the result of a single staking period for a given airdrop and period number.
 */
export async function cacheStakingPeriod(airdrop: StakingAirdrop, periodNumber: number): Promise<void> {
    if (!airdrop || !isValidPeriodNumber(airdrop, periodNumber)) return

    const stakingResult = await fetchStakingResult(airdrop, periodNumber)
    if (!stakingResult) return

    const stakingRewards = getAccountStakingRewards()
    const updatedStakingRewards: AccountStakingRewards[] = stakingRewards.map(
        (accountStakingRewards: AccountStakingRewards) =>
            updateStakingRewardsForAccount(accountStakingRewards, stakingResult, airdrop, periodNumber)
    )

    updateProfile('stakingRewards', updatedStakingRewards)
}

function getAccountStakingRewards(): AccountStakingRewards[] {
    const cachedStakingRewards = get(activeProfile)?.stakingRewards ?? []
    const accountIds = get(get(wallet).accounts).map((account) => account?.id)

    return accountIds.map((accountId, idx) => {
        if (idx > cachedStakingRewards.length - 1) {
            return { accountId }
        } else {
            return { ...cachedStakingRewards[idx], accountId }
        }
    })
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

        let shouldBreak = false
        let uncachedStakingPeriodNumbers = []
        stakingRewards.forEach((stakingReward) => {
            if (shouldBreak) return

            const airdropStakingRewards = stakingReward[airdrop]
            if (!airdropStakingRewards) {
                uncachedStakingPeriodNumbers = range(getLastStakingPeriodNumber(airdrop), 1)
                shouldBreak = true
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
