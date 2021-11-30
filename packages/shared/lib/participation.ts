import { derived, get, Readable, writable } from 'svelte/store'
import {
    ParticipateResponsePayload,
    Participation,
    ParticipationEvent,
    ParticipationEventState,
    ParticipationOverview,
    ParticipationOverviewResponse,
    StakingAirdrop,
} from './typings/participation'
import type { WalletAccount } from './typings/wallet'
import type { Event, } from './typings/events'
import { api, DUST_THRESHOLD, wallet } from './wallet'
import { showAppNotification } from './notifications'
import { MILLISECONDS_PER_SECOND, SECONDS_PER_MILESTONE } from './time'
import { networkStatus } from './networkStatus'

/**
 * Assembly event ID
 */
const ASSEMBLY_EVENT_ID = '11bf14a0b4c4e60554c73a261b878e09d67e4772b876808d2b3c42570eaeb614'

/**
 * Shimmer event ID
 */
const SHIMMER_EVENT_ID = 'e5501ea9c8d950bceffc635275e7ce179a2334c42e9cc4e31c0f3c2c74db3d6a'

export const STAKING_EVENT_IDS: string[] = [ASSEMBLY_EVENT_ID, SHIMMER_EVENT_ID]

export const STAKING_PARTICIPATIONS: Participation[] = [{
    eventId: SHIMMER_EVENT_ID,
    answers: []
}, {
    eventId: ASSEMBLY_EVENT_ID,
    answers: []
}];

/**
 * The overview / statistics about participation. See #AccountParticipationOverview for more details.
 */
export const participationOverview = writable<ParticipationOverview>([])

/**
 * The store for accounts that are currently staked. This is NOT to hold accounts
 * that have been selected for staking / unstaking or have staked in the past.
 *
 * This is updated regularly by the polling
 * in `wallet.rs`.
 */
export const stakedAccounts: Readable<WalletAccount[]> = derived(
    [participationOverview],
    ([$participationOverview]) => {
        const activeAccountIndices =
            $participationOverview
                .filter((overview) => overview.participations.length > 0 && overview.shimmerStakedFunds > 0)
                .map((overview) => overview.accountIndex)
        /**
         * CAUTION: Ideally the accounts Svelte store would
         * be derived, but doing so results in a "cannot
         * access _ before initialization" error.
         */
        const accounts = get(wallet).accounts
        if (!get(accounts)) return []
        else return get(accounts).filter((wa) => activeAccountIndices.includes(wa.index))
    }
)

/**
 * The store for accounts that contain partially staked funds.
 *
 * Accounts are added if upon receiving a new transaction they
 * are currently staked (checks stakedAccounts). Accounts are removed
 * within the staking flow.
 */
export const partiallyStakedAccounts: Readable<WalletAccount[]> = derived(
    [participationOverview],
    ([$participationOverview]) =>
        $participationOverview
            .filter((apo) => apo.shimmerStakedFunds > 0 && apo.shimmerUnstakedFunds > 0)
            .map((apo) => get(get(wallet).accounts).find((wa) => wa.index === apo.accountIndex))
)

export const partiallyStakedAmount: Readable<number> = derived(
    [participationOverview, partiallyStakedAccounts],
    ([$participationOverview, $partiallyStakedAccounts]) =>
        $participationOverview
            .filter((apo) => $partiallyStakedAccounts.map((psa) => psa.index).includes(apo.accountIndex))
            .map((apo) => Math.abs(apo.shimmerStakedFunds - apo.shimmerUnstakedFunds))
            .reduce((total, current) => total + current, 0)
)

/**
 * The amount of funds across all accounts that are
 * currently staked.
 */
export const stakedAmount: Readable<number> = derived(
    participationOverview,
    (overview) =>
        overview.reduce((total, accountOverview) => total + accountOverview?.shimmerStakedFunds, 0)
)

/**
 * The amount of funds across all accounts that are
 * currently unstaked.
 */
export const unstakedAmount: Readable<number> = derived(
    participationOverview,
    (overview) =>
        overview.reduce((total, accountOverview) => total + accountOverview?.shimmerUnstakedFunds, 0)
)

/**
 * The total accumulated Shimmer rewards for all
 * accounts that have been staked (even if they have
 * been unstaked).
 */
export const assemblyStakingRewards: Readable<number> = derived(
    participationOverview,
    (overview) =>
        overview.reduce((total, accountOverview) => total + accountOverview.assemblyRewards, 0)
)

/**
 * The total accumulated Shimmer rewards for all
 * accounts that have been staked (even if they have
 * been unstaked).
 */
export const shimmerStakingRewards: Readable<number> = derived(
    participationOverview,
    (overview) =>
        overview.reduce((total, accountOverview) => total + accountOverview.shimmerRewards, 0)
)

/**
 * The available participation events (staking AND voting).
 */
export const participationEvents = writable<ParticipationEvent[]>([])

/**
 * The status of the staking event, calculated from the milestone information.
 */
export const stakingEventState: Readable<ParticipationEventState> = derived(
    [networkStatus, participationEvents],
    ([$networkStatus, $participationEvents]) => {
        const stakingEvent = $participationEvents.filter((pe) => STAKING_EVENT_IDS.includes(pe.eventId))[0]
        if (!stakingEvent) return ParticipationEventState.Inactive

        const {
            milestoneIndexCommence,
            milestoneIndexStart,
            milestoneIndexEnd,
        } = stakingEvent?.information
        const currentMilestone = $networkStatus?.currentMilestone

        if (currentMilestone < milestoneIndexCommence) {
            return ParticipationEventState.Upcoming
        } else if (currentMilestone < milestoneIndexStart) {
            return ParticipationEventState.Commencing
        } else if (currentMilestone < milestoneIndexEnd) {
            return ParticipationEventState.Holding
        } else {
            return ParticipationEventState.Ended
        }
    }
)

const calculateRemainingStakingTime = (
    currentMilestone: number,
    stakingEvent: ParticipationEvent
): number => {
    if (!stakingEvent) return 0

    const startMilestone = stakingEvent?.information?.milestoneIndexStart
    const endMilestone = stakingEvent?.information?.milestoneIndexEnd
    if (currentMilestone < startMilestone) {
        return 0
    } else if (currentMilestone >= endMilestone) {
        return 0
    } else {
        const timeLeftInMilestones = endMilestone - currentMilestone
        return timeLeftInMilestones * SECONDS_PER_MILESTONE * MILLISECONDS_PER_SECOND
    }
}

/**
 * The remaining time until the Assembly staking event ends (in milliseconds).
 */
export const assemblyStakingRemainingTime: Readable<number> = derived(
    [networkStatus, participationEvents],
    ([$networkStatus, $participationEvents]) =>
        calculateRemainingStakingTime(
            $networkStatus?.currentMilestone,
            $participationEvents.find((pe) => pe.eventId === ASSEMBLY_EVENT_ID)
        )
)

/**
 * The remaining time until the Shimmer staking event ends (in milliseconds).
 */
export const shimmerStakingRemainingTime: Readable<number> = derived(
    [networkStatus, participationEvents],
    ([$networkStatus, $participationEvents]) =>
        calculateRemainingStakingTime(
            $networkStatus?.currentMilestone,
            $participationEvents.find((pe) => pe.eventId === SHIMMER_EVENT_ID)
        )
)

/**
 * Currency symbols for the staking airdrops.
 */
export const STAKING_AIRDROP_TOKENS: { [key in StakingAirdrop]: string } = {
    [StakingAirdrop.Assembly]: 'ASM',
    [StakingAirdrop.Shimmer]: 'SMR',
}

const PARTICIPATION_POLL_DURATION = 10

let participationPollInterval

/**
 * Begins polling of the participation overview.
 *
 * @method pollParticipationOverview
 *
 * @returns {Promise<void>}
 */
export async function pollParticipationOverview(): Promise<void> {
    await getParticipationOverview()
    /* eslint-disable @typescript-eslint/no-misused-promises */
    participationPollInterval = setInterval(
        async () => await getParticipationOverview(),
        PARTICIPATION_POLL_DURATION * MILLISECONDS_PER_SECOND
    )
}

/**
 * Clears the polling interval for the participation overview.
 *
 * @method clearPollParticipationOverviewInterval
 *
 * @returns {void}
 */
export function clearPollParticipationOverviewInterval(): void {
    clearInterval(participationPollInterval)
}

/**
 * Resets the non-derived store variables relevant for participation.
 *
 * @method resetParticipation
 *
 * @returns {void}
 */
export const resetParticipation = (): void => {
    participationOverview.set([])
    participationEvents.set([])
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
export const isAccountStaked = (accountId: string): boolean => get(stakedAccounts).find((sa) => sa.id === accountId) !== undefined

export const isAccountPartiallyStaked = (accountId: string): boolean =>
    get(partiallyStakedAccounts).find((psa) => psa.id === accountId) !== undefined

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

/**
 * Calculates the reward estimate for a particular staking airdrop.
 *
 * @method estimateStakingAirdropReward
 *
 * @param {StakingAirdrop} airdrop
 * @param {number} amountToStake
 *
 * @returns {number}
 */
export const estimateStakingAirdropReward = (airdrop: StakingAirdrop, amountToStake: number): number => {
    const stakingEvent = getStakingEventFromAirdrop(airdrop)
    if (!stakingEvent) {
        showAppNotification({
            type: 'error',
            message: 'Unable to find staking event.',
        })
    }

    /**
     * NOTE: We can use either of these, however since the network status is polled reguarly
     * it will seem more dynamic rather than re-calculating within this function.
     */
    const currentMilestone = get(networkStatus)?.currentMilestone || stakingEvent?.status?.milestoneIndex
    const endMilestone = stakingEvent?.information?.milestoneIndexEnd

    switch (airdrop) {
        case StakingAirdrop.Assembly:
            return estimateAssemblyReward(
                amountToStake, currentMilestone, endMilestone
            )
        case StakingAirdrop.Shimmer:
            return estimateShimmerReward(
                amountToStake, currentMilestone, endMilestone
            )
        default:
            return 0
    }
}

export const getStakedFunds = (account: WalletAccount): number => {
    const accountParticipation = get(participationOverview).find((apo) => apo.accountIndex === account?.index)
    console.log('PART: ', accountParticipation)
    if (!accountParticipation) return 0
    else return accountParticipation.shimmerStakedFunds
}

export const getUnstakedFunds = (account: WalletAccount): number => {
    const accountParticipation = get(participationOverview).find((apo) => apo.accountIndex === account?.index)
    if (!accountParticipation) return 0
    else return accountParticipation.shimmerUnstakedFunds
}

/**
 * Determines if a staking or voting event is available for participation, based
 * off of its current state.
 *
 * @method canParticipate
 *
 * @param {ParticipationEventState} eventState
 *
 * @returns {boolean}
 */
export const canParticipate = (eventState: ParticipationEventState): boolean => {
    switch (eventState) {
        case ParticipationEventState.Commencing:
        case ParticipationEventState.Holding:
            return true
        case ParticipationEventState.Upcoming:
        case ParticipationEventState.Ended:
        default:
            return false
    }
}

/**
 * Determines whether an account can participate in an event.
 *
 * @method canAccountParticipate
 *
 * @param {WalletAccount} account
 *
 * @returns {boolean}
 */
export const canAccountParticipate = (account: WalletAccount): boolean => account?.rawIotaBalance >= DUST_THRESHOLD

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
                participationOverview.set(overview?.payload.accounts)
                console.log('OVERVIEW: ', get(participationOverview))

                resolve()
            },
            onError(error) {
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
                console.log('EVENTS: ', get(participationEvents))

                resolve(response?.payload)
            },
            onError(error) {
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
 * @param {string} accountId
 * @param {Participation[]} participations
 *
 * @returns {Promise<void>}
 */
export function participate(accountId: string, participations: Participation[]): Promise<void> {
    if (!accountId) {
        showAppNotification({
            type: 'error',
            message: 'Unable to use this account data.'
        })

        return
    }

    return new Promise<void>((resolve, reject) => {
        api.participate(
            accountId,
            participations,
            {
                onSuccess(response: Event<ParticipateResponsePayload>) {
                    resolve()
                },
                onError(error) {
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
 * @param {string} accountId
 * @param {string[]} eventIds
 *
 * @returns {Promise<void>}
 */
 export function stopParticipating(accountId: string, eventIds: string[]): Promise<void> {
     if (!accountId) {
         showAppNotification({
             type: 'error',
             message: 'Unable to use this account data.'
         })

         return
     }

    return new Promise<void>((resolve, reject) => {
        api.stopParticipating(
            accountId,
            eventIds,
            {
                onSuccess(response: Event<ParticipateResponsePayload>) {
                    resolve()
                },
                onError(error) {
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
 * @param {Participation[]} participations
 *
 * @returns {Promise<void>}
 */
 export function participateWithRemainingFunds(accountId: string, participations: Participation[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        api.participateWithRemainingFunds(
            accountId,
            participations,
            {
                onSuccess(response: Event<ParticipateResponsePayload>) {
                    resolve()
                },
                onError(error) {
                    console.error(error);

                    reject(error);
                }
            })
    })
}
