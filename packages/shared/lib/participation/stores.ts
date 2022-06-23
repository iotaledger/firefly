import { getStakingEventFromAirdrop } from '@lib/participation/staking'
import { isSoftwareProfile } from '@lib/profile'
import { NetworkStatus } from '@lib/typings/network'
import { persistent } from 'shared/lib/helpers'
import { derived, get, Readable, writable } from 'svelte/store'
import { networkStatus } from '../networkStatus'
import { MILLISECONDS_PER_SECOND, SECONDS_PER_MILESTONE } from '../time'
import { NodePlugin } from '../typings/node'
import { WalletAccount } from '../typings/wallet'
import { transferState, wallet } from '../wallet'
import { ASSEMBLY_EVENT_ID, SHIMMER_EVENT_ID, TREASURY_VOTE_EVENT_ID } from './constants'
import {
    ParticipateResponsePayload,
    Participation,
    ParticipationAction,
    ParticipationEvent,
    ParticipationEventState,
    ParticipationHistoryItem,
    ParticipationOverview,
    PendingParticipation,
    StakingAirdrop,
} from './types'

/**
 * The store for keeping track of pending participations.
 */
export const pendingParticipations = writable<PendingParticipation[]>([])

/**
 * The store for the participation action to perform for the selectedAccount.
 * This is mostly useful for showing background participation progress.
 *
 * If this store is empty (e.g. undefined or null), then there is NOT an account
 * currently trying to participate (or stop) in an event.
 */
export const participationAction = writable<ParticipationAction>(null)

/**
 * Store used to keep track when the user has excplicitly requested to change a participation (eg, governance vote).
 */
export const isChangingParticipation = writable<boolean>(false)

/**
 * The overview / statistics about participation. See #AccountParticipationOverview for more details.
 */
export const participationOverview = writable<ParticipationOverview>([])

/**
 * Whether the user is currently staking or unstaking
 */
export const isPerformingParticipation = writable<boolean>(false)

/**
 * Whether participation overview and events are being fetched
 */
export const isFetchingParticipationInfo = writable<boolean>(false)

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
        const activeAccountIndices = $participationOverview
            .filter((overview) => overview.shimmerStakedFunds > 0 || overview.assemblyStakedFunds > 0)
            // .filter((overview) => overview.participations.length > 0)
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
 * The available participation events (staking AND voting).
 */
export const participationEvents = writable<ParticipationEvent[]>([])

function deriveParticipationEventState(
    stakingEvent: ParticipationEvent,
    networkStatus: NetworkStatus
): ParticipationEventState {
    if (!stakingEvent || !networkStatus.nodePlugins.includes(NodePlugin.Participation)) {
        return ParticipationEventState.Inactive
    }

    const { milestoneIndexCommence, milestoneIndexStart, milestoneIndexEnd } = stakingEvent?.information
    const currentMilestone = networkStatus?.currentMilestone

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

export const assemblyStakingEventState: Readable<ParticipationEventState> = derived(
    [networkStatus, participationEvents],
    ([$networkStatus]) => {
        const stakingEvent = getStakingEventFromAirdrop(StakingAirdrop.Assembly)
        return deriveParticipationEventState(stakingEvent, $networkStatus)
    }
)

export const shimmerStakingEventState: Readable<ParticipationEventState> = derived(
    [networkStatus, participationEvents],
    ([$networkStatus]) => {
        const stakingEvent = getStakingEventFromAirdrop(StakingAirdrop.Shimmer)
        return deriveParticipationEventState(stakingEvent, $networkStatus)
    }
)

export const treasuryEventState: Readable<ParticipationEventState> = derived(
    [networkStatus, participationEvents],
    ([$networkStatus, $participationEvents]) => {
        const treasuryEvent = $participationEvents?.find((p) => p?.eventId === TREASURY_VOTE_EVENT_ID)
        return deriveParticipationEventState(treasuryEvent, $networkStatus)
    }
)

export const calculateRemainingStakingTime = (currentMilestone: number, stakingEvent: ParticipationEvent): number => {
    if (!stakingEvent) return 0

    const commenceMilestone = stakingEvent?.information?.milestoneIndexCommence
    const startMilestone = stakingEvent?.information?.milestoneIndexStart
    const endMilestone = stakingEvent?.information?.milestoneIndexEnd

    const _calculateRemainingTime = (firstMilestone: number, secondMilestone: number): number =>
        Math.abs(secondMilestone - firstMilestone) * SECONDS_PER_MILESTONE * MILLISECONDS_PER_SECOND

    if (currentMilestone < commenceMilestone) {
        return _calculateRemainingTime(currentMilestone, commenceMilestone)
    } else if (currentMilestone < startMilestone) {
        return _calculateRemainingTime(currentMilestone, startMilestone)
    } else if (currentMilestone < endMilestone) {
        return _calculateRemainingTime(currentMilestone, endMilestone)
    } else {
        return 0
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
 * Adds newly broadcasted (yet unconfirmed) participations
 *
 * @method addNewPendingParticipation
 *
 * @param {ParticipateResponsePayload} payload
 * @param {string} accountId
 * @param {ParticipationAction} action
 *
 * @returns {void}
 */
export const addNewPendingParticipation = (
    payload: ParticipateResponsePayload,
    accountId: string,
    action: ParticipationAction,
    participations?: Participation[]
): void => {
    const _pendingParticipation = {
        accountId,
        action,
        participations,
    }

    pendingParticipations.update((_participations) => [
        ..._participations,
        ...payload.map((tx) => Object.assign({}, _pendingParticipation, { messageId: tx.id })),
    ])
}

/**
 * Removes pending participation (after it has confirmed)
 *
 * @method removePendingParticipations
 *
 * @param {string[]} ids
 *
 * @returns {void}
 */
export const removePendingParticipations = (ids: string[]): void => {
    pendingParticipations.update((participations) =>
        participations.filter((participation) => !ids.includes(participation.messageId))
    )
}

/**
 * Determines if a participation message is attached to the Tangle
 *
 * @method isParticipationPending
 *
 * @param {string} id
 *
 * @returns {boolean}
 */
export const isParticipationPending = (id: string): boolean =>
    get(pendingParticipations).some((participation) => participation.messageId === id)

/**
 * Gets a pending participation
 *
 * @method getPendingParticipation
 *
 * @param {string} id
 *
 * @returns {PendingParticipation | undefined}
 */
export const getPendingParticipation = (id: string): PendingParticipation | undefined =>
    get(pendingParticipations).find((participation) => participation.messageId === id)

/**
 * Determines if has a pending participation
 *
 * @method hasPendingParticipation
 *
 * @param {string} id
 *
 * @returns {boolean}
 */
export const hasPendingParticipation = (id: string): boolean =>
    get(pendingParticipations).some((participation) => participation.messageId === id)

export const resetPerformingParticipation = (): void => {
    if (!get(isSoftwareProfile)) {
        transferState.set(null)
    }
    isPerformingParticipation.set(false)
    participationAction.set(undefined)
}

export const participationHistory = persistent<ParticipationHistoryItem[]>('participationHistory', [])
