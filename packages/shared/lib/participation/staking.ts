import { get } from 'svelte/store'
import { getDecimalSeparator } from '../currency'
import { localize } from '../i18n'
import { networkStatus } from '../networkStatus'
import { showAppNotification } from '../notifications'
import { activeProfile } from '../profile'
import type { WalletAccount } from '../typings/wallet'
import { clamp, delineateNumber } from '../utils'
import { ASSEMBLY_EVENT_ID, SHIMMER_EVENT_ID, STAKING_AIRDROP_TOKENS, STAKING_EVENT_IDS } from './constants'
import { partiallyStakedAccounts, participationEvents, participationOverview, stakedAccounts } from './stores'
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

const getAirdropEventId = (airdrop: StakingAirdrop): string => {
    switch (airdrop) {
        case StakingAirdrop.Assembly:
            return STAKING_EVENT_IDS[0]
        case StakingAirdrop.Shimmer:
            return STAKING_EVENT_IDS[1]
        default:
            return undefined
    }
}

/**
 * Determines whether an accounts is staked for a particular airdrop.
 *
 * @method isAccountStakedForAirdrop
 *
 * @param {string} accountId
 * @param {StakingAirdrop} airdrop
 *
 * @returns {boolean}
 */
export const isAccountStakedForAirdrop = (accountId: string, airdrop: StakingAirdrop): boolean => {
    const account = get(stakedAccounts).find((sa) => sa.id === accountId)
    if (!account) return false

    const accountOverview = get(participationOverview).find((apo) => apo.accountIndex === account.index)
    if (!accountOverview) return false

    return accountOverview.participations.find((p) => p.eventId === getAirdropEventId(airdrop)) !== undefined
}

/**
 * Determines if an account is partially staked.
 *
 * @method isAccountPartiallyStaked
 *
 * @param {string} accountId
 * @returns {boolean}
 */
export const isAccountPartiallyStaked = (accountId: string): boolean =>
    get(partiallyStakedAccounts).find((psa) => psa.id === accountId) !== undefined

/**
 * Determines the staking airdrop from a given participation event ID.
 *
 * @method getAirdropFromEventId
 *
 * @param {string} eventId
 *
 * @returns {StakingAirdrop | undefined}
 */
export const getAirdropFromEventId = (eventId: string): StakingAirdrop | undefined => {
    if (!eventId) return undefined

    if (!STAKING_EVENT_IDS.includes(eventId)) {
        showAppNotification({
            type: 'error',
            message: localize('error.participation.invalidStakingEventId'),
        })
    }

    return eventId === ASSEMBLY_EVENT_ID ? StakingAirdrop.Assembly : StakingAirdrop.Shimmer
}

const estimateAssemblyReward = (amount: number, currentMilestone: number, endMilestone: number): number => {
    /**
     * NOTE: This represents the amount of ASMB per 1 Mi received every milestone,
     * which is currently 4 microASMB (0.000004 ASMB).
     */
    const multiplier = 0.000004
    const numMilestones = endMilestone - currentMilestone

    return Math.floor(multiplier * amount * numMilestones)
}

const estimateShimmerReward = (amount: number, currentMilestone: number, endMilestone: number): number => {
    /**
     * NOTE: This represents the amount of SMR per 1 Mi received every milestone,
     * which is currently 1 SMR.
     */
    const multiplier = 1.0
    const amountMiotas = amount / 1_000_000
    const numMilestones = endMilestone - currentMilestone

    return multiplier * amountMiotas * numMilestones
}

type AssemblyTokenUnit = '' | 'micro'

const getAssemblyTokenMultiplier = (unit: AssemblyTokenUnit): number => {
    switch (unit) {
        case 'micro':
            return 1
        default:
            return 0.000001
    }
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

    let reward
    switch (airdrop) {
        case StakingAirdrop.Assembly: {
            decimalPlaces = clamp(decimalPlaces, 0, 6)

            const [integer, float] = (amount / 1_000_000).toFixed(decimalPlaces).split('.')
            reward = parseFloat(delineateNumber(integer, thousandthSeparator) + decimalSeparator + float)

            break
        }
        case StakingAirdrop.Shimmer: {
            reward = delineateNumber(String(amount), thousandthSeparator)
            break
        }
        default:
            reward = '0'
            break
    }

    return `${reward} ${STAKING_AIRDROP_TOKENS[airdrop]}`
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
    let stakingEventId
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
 * Calculates the reward estimate for a particular staking airdrop.
 *
 * @method estimateStakingAirdropReward
 *
 * @param {StakingAirdrop} airdrop
 * @param {number} amountToStake
 * @param {boolean} formatAmount
 * @param {number} decimalPlaces
 *
 * @returns {number | string}
 */
export const estimateStakingAirdropReward = (
    airdrop: StakingAirdrop,
    amountToStake: number,
    formatAmount: boolean = false,
    decimalPlaces: number = 6
): number | string => {
    const stakingEvent = getStakingEventFromAirdrop(airdrop)
    if (!stakingEvent || amountToStake <= 0) {
        return formatAmount ? formatStakingAirdropReward(airdrop, 0, decimalPlaces) : 0
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

    let estimation
    switch (airdrop) {
        case StakingAirdrop.Assembly:
            estimation = estimateAssemblyReward(amountToStake, beginMilestone, endMilestone)
            break
        case StakingAirdrop.Shimmer:
            estimation = estimateShimmerReward(amountToStake, beginMilestone, endMilestone)
            break
        default:
            estimation = 0
            break
    }

    return formatAmount ? formatStakingAirdropReward(airdrop, estimation, decimalPlaces) : estimation
}

/**
 * Calculate the staked funds for a particular account.
 *
 * @method getStakedFunds
 *
 * @param {WalletAccount} account
 *
 * @returns {number}
 */
export const getStakedFunds = (account: WalletAccount): number => {
    const accountParticipation = get(participationOverview).find((apo) => apo.accountIndex === account?.index)
    if (!accountParticipation) return 0
    else return Math.max(accountParticipation.assemblyStakedFunds, accountParticipation.shimmerStakedFunds)
}

/**
 * Calculate the unstaked funds for a particular account.
 *
 * @method getUnstakedFunds
 *
 * @param {WalletAccount} account
 *
 * @returns {number}
 */
export const getUnstakedFunds = (account: WalletAccount): number => {
    const accountParticipation = get(participationOverview).find((apo) => apo.accountIndex === account?.index)
    if (!accountParticipation) return 0
    else return Math.min(accountParticipation.assemblyUnstakedFunds, accountParticipation.shimmerUnstakedFunds)
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
    stakingEventState !== ParticipationEventState.Ended && stakingEventState !== ParticipationEventState.Inactive
