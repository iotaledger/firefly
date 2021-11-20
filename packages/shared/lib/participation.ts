import { derived, get, writable } from 'svelte/store'
import {
    ParticipateResponsePayload,
    Participation,
    ParticipationEvent,
    ParticipationOverviewResponse,
    StakingAirdrop,
    StakingAirdropRewards,
    StakingEventStatus,
    StakingOverview
} from './typings/participation'
import type { WalletAccount } from './typings/wallet'
import type { Event, } from './typings/events'
import { persistent } from './helpers'
import { api } from './wallet'
import { showAppNotification } from './notifications'
import { participation } from './typings'

/** Assembly event ID */
const ASSEMBLY_EVENT_ID = 'c4f23236b3ce22f9fe22583176813618b304bbfcfd24da68cbddf66196b0d8fd';

/** Shimmer event ID. */
const SHIMMER_EVENT_ID = '415267d375c85531aec13e6471c04a01622dfcc9b285a009629dd2c9231da517';

const STAKING_EVENT_IDS: string[] = [ASSEMBLY_EVENT_ID, SHIMMER_EVENT_ID]

const STAKING_PARTICIPATIONS: Participation[] = [{
    eventId: SHIMMER_EVENT_ID,
    answers: []
}, {
    eventId: ASSEMBLY_EVENT_ID,
    answers: []
}];

/** Overview / Statistics about participation. See #StakingAccountOverview for more details. */
export const participationOverview = writable<StakingOverview>([])

export const participationEvents = writable<ParticipationEvent[]>([])

/** Shimmer staking remaining days */
export const shimmerStakingRemainingDays = writable<number>(0)

/** Assembly staking remaining days */
export const assemblyStakingRemainingDays = writable<number>(0)

/** Total staked amount for all accounts */
export const stakedAmount = derived(participationOverview, (overview) => overview.reduce((acc, accountOverview) => {
    // Since firefly stakes both assembly & shimmer as a whole, just pick one
    acc += accountOverview.shimmerStakedFunds;

    return acc;
}, 0))

/** Total unstaked amount for all accounts */
export const unstakedAmount = derived(participationOverview, (overview) => overview.reduce((acc, accountOverview) => {
    // Since firefly stakes both assembly & shimmer as a whole, just pick one
    acc += accountOverview.shimmerUnstakedFunds;

    return acc;
}, 0))

/** Total shimmer rewards for all accounts */
export const shimmerRewards = derived(participationOverview, (overview) => overview.reduce((acc, accountOverview) => acc += accountOverview.shimmerRewards, 0))

/** Total assembly rewards for all accounts */
export const assemblyRewards = derived(participationOverview, (overview) => overview.reduce((acc, accountOverview) => acc += accountOverview.assemblyRewards, 0))

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

const estimateAssemblyReward = (amount: number, currentMilestone: number, endMilestone: number): number => {
    const multiplier = 1.0
    const amountMiotas = amount / 1_000_000
    const numMilestones = endMilestone - currentMilestone

    return multiplier * amountMiotas * numMilestones + 1
}

const estimateShimmerReward = (amount: number, currentMilestone: number, endMilestone: number): number => {
    const multiplier = 1.0
    const amountMiotas = amount / 1_000_000
    const numMilestones = endMilestone - currentMilestone

    return multiplier * amountMiotas * numMilestones
}

const getStakingEventFromAirdrop = (airdrop: StakingAirdrop): ParticipationEvent => {
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

export const estimateStakingAirdropReward = (airdrop: StakingAirdrop, amountToStake: number): number => {
    const stakingEvent = getStakingEventFromAirdrop(airdrop)
    if (!stakingEvent) {
        showAppNotification({
            type: 'error',
            message: 'Unable to find staking event.',
        })
    }

    switch (airdrop) {
        case StakingAirdrop.Assembly:
            return estimateAssemblyReward(
                amountToStake, stakingEvent?.status?.milestoneIndex, stakingEvent?.information?.milestoneIndexEnd
            )
        case StakingAirdrop.Shimmer:
            return estimateShimmerReward(
                amountToStake, stakingEvent?.status?.milestoneIndex, stakingEvent?.information?.milestoneIndexEnd
            )
        default:
            return 0
    }
}

/**
 * Gets participation overview.
 *
 * @method getParticipationOverview
 *
 * @returns {Promise<void>}
 */
export function getParticipationOverview(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        api.getParticipationOverview({
            onSuccess(overview: Event<ParticipationOverviewResponse>) {
                participationOverview.set(overview.payload.accounts)

                resolve()
            },
            onError(error) {
                // TODO: What to do in case of error? Probably throw a notification here.
                console.error(error)

                reject(error)
            }
        })
    })
}

/**
 * Gets participation event details.
 *
 * @method getParticipationEvents
 *
 * @returns {Promise<ParticipationEvent[]>}
 */
export function getParticipationEvents(): Promise<ParticipationEvent[]> {
    return new Promise<ParticipationEvent[]>((resolve, reject) => {
        api.getParticipationEvents({
            onSuccess(response: Event<ParticipationEvent[]>) {
                participationEvents.set(response?.payload)

                resolve(response?.payload)
            },
            onError(error) {
                // TODO: What to do in case of error?
                console.error(error)

                reject(error)
            }
        })
    })
}

/**
 * Participate in events.
 *
 * @method participate
 *
 * @param {WalletAccount} account
 *
 * @returns {Promise<void>}
 */
export function participate(account: WalletAccount): Promise<void> {
    if (!account) {
        showAppNotification({
            type: 'error',
            message: 'Unable to use this account data.'
        })

        return
    }

    return new Promise<void>((resolve, reject) => {
        api.participate(
            account?.id,
            STAKING_PARTICIPATIONS,
            {
                onSuccess(response: Event<ParticipateResponsePayload>) {
                    console.log('PARTICIPATED: ', response.payload)
                    stakedAccounts.update((_stakedAccounts) => [..._stakedAccounts, account])

                    resolve()
                },
                onError(error) {
                    // TODO: What to do in case of error?
                    console.error(error)

                    reject(error)
                }
            })
    })
}

/**
 * Stop paticipating in events.
 *
 * @method stopParticipating
 *
 * @param {WalletAccount} account
 *
 * @returns {Promise<void>}
 */
 export function stopParticipating(account: WalletAccount): Promise<void> {
     if (!account) {
         showAppNotification({
             type: 'error',
             message: 'Unable to use this account data.'
         })

         return
     }

    return new Promise<void>((resolve, reject) => {
        api.stopParticipating(
            account?.id,
            STAKING_EVENT_IDS,
            {
                onSuccess(response: Event<ParticipateResponsePayload>) {
                    stakedAccounts.update((_stakedAccounts) =>
                        _stakedAccounts.filter((sa) => sa.id !== account?.id)
                    )

                    resolve()
                },
                onError(error) {
                    // TODO: What to do in case of error?
                    console.error(error)

                    reject(error)

                }
            })
    })
}

/**
 * Participate with remaining funds in events.
 *
 * @method participateWithRemainingFunds
 *
 * @param {string} accountId
 *
 * @returns {Promise<void>}
 */
 export function participateWithRemainingFunds(accountId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        api.participateWithRemainingFunds(
            accountId,
            STAKING_PARTICIPATIONS,
            {
                onSuccess(response: Event<ParticipateResponsePayload>) {
                    resolve()
                },
                onError(error) {
                    // TODO: What to do in case of error?
                    console.error(error);
                    reject(error);
                }
            })
    })
}
