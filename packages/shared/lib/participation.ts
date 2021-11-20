import { get, writable, derived } from 'svelte/store'
import {
    StakingAirdrop,
    StakingEventStatus,
    StakingOverview,
    StakingOverviewResponse,
    ParticipationEvent,
    ParticipateResponsePayload, Participation
} from './typings/participation'
import type { WalletAccount } from './typings/wallet'
import type {
    Event,
} from './typings/events'
import { persistent } from './helpers'
import { api } from './wallet'
import { SECONDS_PER_DAY } from './time'

/** Shimmer event ID. */
const SHIMMER_EVENT_ID = '415267d375c85531aec13e6471c04a01622dfcc9b285a009629dd2c9231da517';

/** Assembly event ID */
const ASSEMBLY_EVENT_ID = 'c4f23236b3ce22f9fe22583176813618b304bbfcfd24da68cbddf66196b0d8fd';

const STAKING_EVENT_IDS = [SHIMMER_EVENT_ID, ASSEMBLY_EVENT_ID];

const STAKING_PARTICIPATIONS: Participation[] = [{
    eventId: SHIMMER_EVENT_ID,
    answers: []
}, {
    eventId: ASSEMBLY_EVENT_ID,
    answers: []
}];

/** Overview / Statistics about participation. See #StakingAccountOverview for more details. */
export const participationOverview = writable<StakingOverview>([])

/** Shimmer staking remaining days */
export const shimmerStakingRemainingDays = writable<number>(0)

/** Assembly staking remaining days */
export const assemblyStakingRemainingDays = writable<number>(0)

/** Total staked amount for all accounts */
export const stakedAmount = derived(participationOverview, (overview) => overview.reduce((acc, accountOverview) => {
    // Since firefly stakes both assembly & shimmer as a whole, just pick one
    acc += accountOverview.shimmerStakedFunds;

    return acc;
}, 0)
)

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

export const isAccountStaked = (accountId: string): boolean =>
    get(stakedAccounts).find((a) => a.id === accountId) !== undefined

export const isAccountPartiallyStaked = (accountId: string): boolean => {
    return true
}

export const estimateStakingAirdropReward = (amount: number, airdrop: StakingAirdrop): number => {
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

// OLD
export const queryStakingEventStatus = (): StakingEventStatus => {
    return StakingEventStatus.PreStake
}

/**
 * Gets participation overview
 *
 * @method getParticipationOverview
 *
 * @returns {Promise<void>}
 */
export function getParticipationOverview(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        api.getParticipationOverview({
            onSuccess(overview: Event<StakingOverviewResponse>) {
                participationOverview.set(overview.payload.accounts);
                resolve()
            },
            onError(error) {
                // TODO: What to do in case of error? Probably throw a notification here.
                console.error(error);
                reject(error);
            }
        })
    })
}

/**
 * Gets participation event details
 *
 * @method getParticipationEvents
 *
 * @returns {Promise<void>}
 */
export function getParticipationEvents(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        api.getParticipationEvents({
            onSuccess(participationEvents: Event<ParticipationEvent[]>) {
                const events = participationEvents.payload.filter(
                    (participationEvent) => participationEvent.eventId === SHIMMER_EVENT_ID || participationEvent.eventId === ASSEMBLY_EVENT_ID)

                events.forEach((event) => {
                    const duration = event.information.milestoneIndexEnd - event.status.milestoneIndex;

                    const days = Math.ceil(duration * 10 / SECONDS_PER_DAY)

                    shimmerStakingRemainingDays.set(days);
                    assemblyStakingRemainingDays.set(days)

                })
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

/**
 * Participate in events
 *
 * @method participate
 *
 * @returns {Promise<void>}
 */
export function participate(accountId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        api.participate(
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

/**
 * Stop paticipating in events
 *
 * @method stopParticipating
 *
 * @returns {Promise<void>}
 */
 export function stopParticipating(accountId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        api.stopParticipating(
            accountId,
            STAKING_EVENT_IDS,
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

/**
 * Participate with remaining funds in events
 *
 * @method participateWithRemainingFunds
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
