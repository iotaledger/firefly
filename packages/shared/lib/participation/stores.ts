import { derived, get, Readable, writable } from 'svelte/store'

import { persistent } from '../helpers'
import { networkStatus } from '../networkStatus'
import { MILLISECONDS_PER_SECOND, SECONDS_PER_MILESTONE } from '../time'
import { wallet } from '../wallet'
import type { WalletAccount } from '../typings/wallet'

import { ASSEMBLY_EVENT_ID, SHIMMER_EVENT_ID, STAKING_EVENT_IDS } from './constants'
import {
    ParticipationAction,
    ParticipationEvent,
    ParticipationEventState,
    ParticipationOverview,
    ParticipateResponsePayload
} from './types'

/**
 * The store for keeping track of transaction ids generated as part of participation events.
 */
 export const pendingParticipationTransactionIds = writable<string[]>([])

/**
 * The persisted store variable for if the staking feature is new for a Firefly installation.
 * Once the user navigates to the staking dashboard, this is set to false. This helps the UX
 * to highlight the new feature.
 */
export const isStakingFeatureNew = persistent('isStakingFeatureNew', true)

/**
 * The store for an account that is selected to participate in an event. This is
 * mostly useful for showing background participation progress, otherwise it can
 * just be shown within a designated component (i.e. popup or dashboard tile).
 *
 * If this store is empty (e.g. undefined or null), then there is NOT an account
 * currently trying to participate (or stop) in an event.
 */
export const accountToParticipate = writable<WalletAccount>(null)

/**
 * The store for the participation action to perform for the "accountToParticipate". Similar
 * to the "accountToParticipate", this is mostly useful for showing background participation
 * progress.
 *
 * If this store is empty (e.g. undefined or null), then there is NOT an account
 * currently trying to participate (or stop) in an event.
 */
export const participationAction = writable<ParticipationAction>(null)

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
                // .filter((overview) => overview.shimmerStakedFunds > 0)
                .filter((overview) => overview.participations.length > 0)
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
            .map((apo) => apo.shimmerUnstakedFunds)
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
    (overview) => {
        const rewards = overview.reduce((total, accountOverview) => total + accountOverview.assemblyRewards, 0)
        if (rewards <= 0) return overview.reduce((total, accountOverview) => total + accountOverview.assemblyRewardsBelowMinimum, 0)
        else return rewards
    }
)

/**
 * The total accumulated Shimmer rewards for all
 * accounts that have been staked (even if they have
 * been unstaked).
 */
export const shimmerStakingRewards: Readable<number> = derived(
    participationOverview,
    (overview) => {
        const rewards = overview.reduce((total, accountOverview) => total + accountOverview.shimmerRewards, 0)
        if (rewards <= 0) return overview.reduce((total, accountOverview) => total + accountOverview.shimmerRewardsBelowMinimum, 0)
        else return rewards
    }
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
 * Adds newly broadcasted (yet unconfirmed) message ids that were generated as part of participation event.
 *
 * @method addNewPendingParticipationTransactionIds
 *
 * @param {ParticipateResponsePayload} payload
 *
 * @returns {void}
 */
export const addNewPendingParticipationTransactionIds = (payload: ParticipateResponsePayload): void => {
    pendingParticipationTransactionIds.update((txs) => [...txs, ...payload.map((tx) => tx.id)]);
};

/**
 * Removes pending participation transaction id (after it has confirmed)
 *
 * @method removePendingParticipationTransactionIds
 *
 * @param {ParticipateResponsePayload} payload
 *
 * @returns {void}
 */
 export const removePendingParticipationTransactionIds = (ids: string[]): void => {
    pendingParticipationTransactionIds.update((txs) => txs.filter((id) => !ids.includes(id)));
};
