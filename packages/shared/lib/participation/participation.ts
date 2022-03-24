import { DUST_THRESHOLD, hasValidPendingTransactions } from '../wallet'
import { WalletAccount } from '../typings/wallet'

import { getParticipationOverview } from './api'
import { PARTICIPATION_POLL_DURATION } from './constants'
import { canAccountReachMinimumAirdrop } from './account'
import {
    isPerformingParticipation,
    participationAction,
    participationEvents,
    participationOverview,
    pendingParticipations,
    participationHistory,
} from './stores'
import {
    AccountParticipationAbility,
    ParticipationAction,
    ParticipationEventState,
    ParticipationEventType,
    StakingAirdrop,
    TrackedParticipationItem,
} from './types'
import { get } from 'svelte/store'
import { ASSEMBLY_EVENT_ID, SHIMMER_EVENT_ID } from './constants'

let participationPollInterval

/**
 * Begins polling of the participation overview.
 *
 * @method pollParticipationOverview
 *
 * @returns {Promise<void>}
 */
export async function pollParticipationOverview(): Promise<void> {
    clearPollParticipationOverviewInterval()
    try {
        await getParticipationOverview()
        /* eslint-disable @typescript-eslint/no-misused-promises */
        participationPollInterval = setInterval(async () => getParticipationOverview(), PARTICIPATION_POLL_DURATION)
    } catch (error) {
        if (error && error?.error.includes('pluginNotFound')) {
            clearPollParticipationOverviewInterval()
        }
    }
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
    isPerformingParticipation.set(false)
    participationAction.set(null)
    participationEvents.set([])
    participationOverview.set([])
    pendingParticipations.set([])
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
export const canParticipate = (eventState: ParticipationEventState): boolean =>
    eventState === ParticipationEventState.Commencing || eventState === ParticipationEventState.Holding

/**
 * Determines whether an account can participate in an event.
 *
 * @method getAccountParticipationAbility
 *
 * @param {WalletAccount} account
 *
 * @returns {AccountParticipationAbility}
 */
export const getAccountParticipationAbility = (account: WalletAccount): AccountParticipationAbility => {
    if (account?.rawIotaBalance < DUST_THRESHOLD) {
        return AccountParticipationAbility.HasDustAmount
    } else if (hasValidPendingTransactions(account)) {
        return AccountParticipationAbility.HasPendingTransaction
    } else if (!canAccountReachMinimumAirdrop(account, StakingAirdrop.Assembly)) {
        return AccountParticipationAbility.WillNotReachMinAirdrop
    } else {
        return AccountParticipationAbility.Ok
    }
}

/**
 * Returns ParticipationAction for transaction message
 *
 * @method getMessageParticipationAction
 *
 * @param {WalletAccount} account
 *
 * @returns {ParticipationAction}
 */
export const getMessageParticipationAction = (messageId: string): ParticipationAction => {
    const matchedHistoryItem = get(participationHistory)?.find((item) => item.messageId === messageId)
    if (matchedHistoryItem?.action) {
        return matchedHistoryItem.action
    } else {
        const stakingEndMilestoneIndexes = get(participationEvents)
            ?.filter((event) => event.eventId === ASSEMBLY_EVENT_ID || event.eventId === SHIMMER_EVENT_ID)
            ?.map((event) => event.information?.milestoneIndexEnd)
        const messageMilestone = 0
        if (stakingEndMilestoneIndexes?.find((milestone) => milestone > messageMilestone)) {
            return ParticipationAction.Stake
        } else if (stakingEndMilestoneIndexes?.length) {
            return ParticipationAction.Vote
        }
    }
}
