import { IAccountState, selectedAccountId } from '@core/account'
import { INetworkStatus, networkStatus, SECONDS_PER_MILESTONE } from '@core/network'
import { activeAccounts } from '@core/profile'
import { getStakingEventFromAirdrop, isAirdropAvailable } from './staking'
import { derived, get, Readable, writable } from 'svelte/store'
import { MILLISECONDS_PER_SECOND } from '../time'
import { ASSEMBLY_EVENT_ID, SHIMMER_EVENT_ID } from './constants'
import {
    AccountParticipationOverview,
    ParticipateResponsePayload,
    ParticipationAction,
    ParticipationEvent,
    ParticipationEventState,
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
 * The overview / statistics about participation. See #AccountParticipationOverview for more details.
 */
export const participationOverview = writable<ParticipationOverview>([])

/**
 * Whether the user is currently staking or unstaking
 */
export const isPerformingParticipation = writable<boolean>(false)

/**
 * The store for accounts that are currently staked. This is NOT to hold accounts
 * that have been selected for staking / unstaking or have staked in the past.
 *
 * This is updated regularly by the polling
 * in `wallet.rs`.
 */
// TODO: remove this
export const stakedAccounts: Readable<IAccountState[]> = derived(
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
        if (!get(activeAccounts)) return []
        else return get(activeAccounts).filter((wa) => activeAccountIndices.includes(wa.meta.index))
    }
)

export const selectedAccountParticipationOverview = derived(
    [participationOverview /* selectedAccount */],
    ([$participationOverview /* $selectedAccount */]) =>
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        $participationOverview?.find(({ accountIndex }) => /* accountIndex === $selectedAccount?.meta.index) ?? */ null)
)

/**
 * The amount of funds that are currently staked on the selected account. This amount may differ
 * between airdrops, so we pick the highest number (this is only possible
 * because the same funds may be staked for both airdrops).
 */
export const stakedAmount: Readable<number> = derived(
    selectedAccountParticipationOverview,
    ($selectedAccountParticipationOverview) => {
        let total = 0
        if ($selectedAccountParticipationOverview) {
            const { shimmerStakedFunds, assemblyStakedFunds } = $selectedAccountParticipationOverview
            if (shimmerStakedFunds > 0 && assemblyStakedFunds > 0) {
                total += Math.max(shimmerStakedFunds, assemblyStakedFunds)
            } else {
                total += shimmerStakedFunds
                total += assemblyStakedFunds
            }
        }
        return total
    }
)

/**
 * The amount of funds that are currently unstaked on the selected account. This amount may differ
 * between airdrops, so we pick the lowest number (this is only possible
 * because the same funds may be staked for both airdrops).
 */
export const unstakedAmount: Readable<number> = derived(
    selectedAccountParticipationOverview,
    ($selectedAccountParticipationOverview) => {
        let total = 0
        if ($selectedAccountParticipationOverview) {
            const { shimmerUnstakedFunds, assemblyUnstakedFunds } = $selectedAccountParticipationOverview
            total += Math.min(shimmerUnstakedFunds, assemblyUnstakedFunds)
        }
        return total
    }
)

// TODO: replace its old use partiallyStakedAccounts
export const isPartiallyStaked: Readable<boolean> = derived(
    selectedAccountParticipationOverview,
    ($selectedAccountParticipationOverview) =>
        ($selectedAccountParticipationOverview?.assemblyStakedFunds > 0 &&
            $selectedAccountParticipationOverview?.assemblyUnstakedFunds > 0) ||
        ($selectedAccountParticipationOverview?.shimmerStakedFunds > 0 &&
            $selectedAccountParticipationOverview?.shimmerUnstakedFunds > 0)
)

/**
 * The store for the total amount of funds that are partially (un)staked for
 * the selected account.
 */
export const partiallyUnstakedAmount: Readable<number> = derived(
    selectedAccountParticipationOverview,
    ($selectedAccountParticipationOverview) => {
        const assemblyPartialFunds =
            $selectedAccountParticipationOverview?.assemblyStakedFunds > 0 &&
            $selectedAccountParticipationOverview?.assemblyUnstakedFunds > 0
                ? $selectedAccountParticipationOverview?.assemblyUnstakedFunds
                : 0
        const shimmerPartialFunds =
            $selectedAccountParticipationOverview?.shimmerStakedFunds > 0 &&
            $selectedAccountParticipationOverview?.shimmerUnstakedFunds > 0
                ? $selectedAccountParticipationOverview?.shimmerUnstakedFunds
                : 0

        return Math.max(assemblyPartialFunds, shimmerPartialFunds)
    }
)

function getCurrentStakingRewards(airdrop: StakingAirdrop, accountOverview: AccountParticipationOverview): number {
    if (!airdrop || !isAirdropAvailable(airdrop) || !accountOverview) {
        return 0
    }

    const rewardsKey = `${airdrop}Rewards`
    const rewardsBelowMinimumKey = `${airdrop}RewardsBelowMinimum`

    /**
     * NOTE: We return the sum of rewards and rewardsBelowMinimum here because it is possible that an
     * account has accumulated more than min rewards for an airdrop, but has unstaked and moved the funds
     * to another address that has NOT reach the minimum.
     */
    return accountOverview[rewardsKey] <= 0
        ? accountOverview[rewardsBelowMinimumKey]
        : accountOverview[rewardsKey] + accountOverview[rewardsBelowMinimumKey]
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getCachedStakingRewards(airdrop: StakingAirdrop, accountId: string): number {
    // if (!airdrop || !accountId) return 0

    // // const stakingRewards = get(activeProfile)?.stakingRewards
    // // if (!stakingRewards) return 0

    // // const accountStakingRewards = stakingRewards.find((_stakingRewards) => _stakingRewards.accountId === accountId)
    // // if (!accountStakingRewards) return 0

    // return accountStakingRewards[airdrop]?.totalAirdropRewards || 0
    return 0
}

/**
 * The current accumulated Assembly rewards for the selected
 * account that have been staked at some point (even
 * if they are currently unstaked) in the current staking period.
 *
 * Be cautious that this value is in microASMB, so it is likely to be larger.
 */
export const currentAssemblyStakingRewards: Readable<number> = derived(
    [selectedAccountParticipationOverview],
    ([$selectedAccountParticipationOverview]) =>
        getCurrentStakingRewards(StakingAirdrop.Assembly, $selectedAccountParticipationOverview)
)

/**
 * The current accumulated Assembly rewards for the selected account
 * that are below the minimum rewards requirement.
 */
export const currentAssemblyStakingRewardsBelowMinimum: Readable<number> = derived(
    [selectedAccountParticipationOverview],
    ([$selectedAccountParticipationOverview]) =>
        getCurrentStakingRewards(StakingAirdrop.Assembly, $selectedAccountParticipationOverview) -
        ($selectedAccountParticipationOverview?.assemblyRewards ?? 0)
)

/**
 * The total accumulated Assembly rewards for the selected account.
 */
export const totalAssemblyStakingRewards: Readable<number> = derived(
    [currentAssemblyStakingRewards, selectedAccountId],
    ([$currentAssemblyStakingRewards, $selectedAccountId]) =>
        $currentAssemblyStakingRewards + getCachedStakingRewards(StakingAirdrop.Assembly, $selectedAccountId)
)

/**
 * The current accumulated Shimmer rewards for the selected
 * account that have been staked at some point (even
 * if they are currently unstaked) in the current staking period.
 */
export const currentShimmerStakingRewards: Readable<number> = derived(
    [selectedAccountParticipationOverview],
    ([$selectedAccountParticipationOverview]) =>
        getCurrentStakingRewards(StakingAirdrop.Shimmer, $selectedAccountParticipationOverview)
)

/**
 * The current accumulated Shimmer rewards for the selected account
 * that are below the minimum rewards requirement.
 */
export const currentShimmerStakingRewardsBelowMinimum: Readable<number> = derived(
    [selectedAccountParticipationOverview],
    ([$selectedAccountParticipationOverview]) =>
        getCurrentStakingRewards(StakingAirdrop.Shimmer, $selectedAccountParticipationOverview) -
        ($selectedAccountParticipationOverview?.shimmerRewards ?? 0)
)

/**
 * The total accumulated Shimmer rewards for the selected account.
 */
export const totalShimmerStakingRewards: Readable<number> = derived(
    [currentShimmerStakingRewards, selectedAccountId],
    ([$currentShimmerStakingRewards, $selectedAccountId]) =>
        $currentShimmerStakingRewards + getCachedStakingRewards(StakingAirdrop.Shimmer, $selectedAccountId)
)

/**
 * The available participation events (staking AND voting).
 */
export const participationEvents = writable<ParticipationEvent[]>([])

function deriveParticipationEventState(
    stakingEvent: ParticipationEvent,
    networkStatus: INetworkStatus
): ParticipationEventState {
    // if (!stakingEvent || !networkStatus.nodePlugins.includes(NodePlugin.Participation)) {
    if (!stakingEvent) {
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
    action: ParticipationAction
): void => {
    const _pendingParticipation = {
        accountId,
        action,
    }

    pendingParticipations.update((participations) => [
        ...participations,
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
