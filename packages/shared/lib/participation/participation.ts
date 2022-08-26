import { get } from 'svelte/store'
import { WalletAccount } from '../typings/wallet'
import { DUST_THRESHOLD, hasValidPendingTransactions } from '../wallet'
import { canAccountReachMinimumAirdrop } from './account'
import { getParticipationOverview, getParticipationEvents } from './api'
import { ASSEMBLY_EVENT_ID, LAST_MILESTONE_BEFORE_TREASURY_EVENT, PARTICIPATION_POLL_DURATION } from './constants'
import {
    isChangingParticipation,
    isPerformingParticipation,
    participationAction,
    participationEvents,
    participationHistory,
    participationOverview,
    pendingParticipations,
    isFetchingParticipationInfo,
} from './stores'
import { AccountParticipationAbility, ParticipationAction, ParticipationEventState, StakingAirdrop } from './types'
import { getDurationString, milestoneToDate } from '@lib/time'

let shouldPollParticipation = true
let participationPollTimeout

/**
 * Get participation overview data and latest events.
 *
 * @method fetchParticipationInfo
 *
 * @returns {Promise<void>}
 */
export async function fetchParticipationInfo(): Promise<void> {
    isFetchingParticipationInfo.set(true)
    await Promise.all([getParticipationOverview(ASSEMBLY_EVENT_ID), getParticipationEvents()])
    isFetchingParticipationInfo.set(false)
}

/**
 * Polls participation events 10s after the last poll completes.
 *
 * @method pollParticipation
 *
 * @returns {Promise<void>}
 */
export async function pollParticipation(): Promise<void> {
    try {
        if (get(isFetchingParticipationInfo) || !shouldPollParticipation) return
        await fetchParticipationInfo()
        /* eslint-disable @typescript-eslint/no-misused-promises */
        participationPollTimeout = setTimeout(async () => {
            await pollParticipation()
        }, PARTICIPATION_POLL_DURATION)
    } catch (error) {
        isFetchingParticipationInfo.set(false)
        if (error && error?.error.includes('pluginNotFound')) {
            stopParticipationPoll()
        }
    }
}

/**
 * Begins polling of the participation events.
 *
 * @method startParticipationPoll
 *
 * @returns {void}
 */
export function startParticipationPoll(): void {
    shouldPollParticipation = true
    pollParticipation()
}

/**
 * Clears the polling interval for the participation overview.
 *
 * @method clearPollParticipationTimeout
 *
 * @returns {void}
 */
export function stopParticipationPoll(): void {
    shouldPollParticipation = false
    clearTimeout(participationPollTimeout)
}

/**
 * Resets the non-derived store variables relevant for participation.
 *
 * @method resetParticipation
 *
 * @returns {void}
 */
export const resetParticipation = (): void => {
    isFetchingParticipationInfo.set(false)
    isPerformingParticipation.set(false)
    participationAction.set(null)
    isChangingParticipation.set(false)
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
export const getMessageParticipationAction = (messageId: string, timestamp: string): ParticipationAction => {
    const matchedHistoryItem = get(participationHistory)?.find((item) => item.messageId === messageId)
    if (matchedHistoryItem?.action) {
        return matchedHistoryItem.action
    }
    if (timestamp) {
        const lastDateBeforeTreasuryEvent = milestoneToDate(LAST_MILESTONE_BEFORE_TREASURY_EVENT)
        const messageDate = new Date(timestamp)
        if (messageDate <= lastDateBeforeTreasuryEvent) {
            return ParticipationAction.Stake
        }
    }
}
