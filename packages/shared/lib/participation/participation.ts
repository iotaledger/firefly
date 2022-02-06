import { DUST_THRESHOLD, hasValidPendingTransactions } from '../wallet'
import type { WalletAccount } from '../typings/wallet'

import { getParticipationOverview } from './api'
import { PARTICIPATION_POLL_DURATION } from './constants'
import { canAccountReachMinimumAirdrop } from './staking'
import {
    accountToParticipate,
    isPerformingParticipation,
    participationAction,
    participationEvents,
    participationOverview,
    pendingParticipations,
} from './stores'
import { AccountParticipationAbility, Participation, ParticipationEventState, StakingAirdrop } from './types'

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
    accountToParticipate.set(null)
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
 * @method getAccountParticipationAbility
 *
 * @param {WalletAccount} account
 *
 * @returns {boolean}
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
