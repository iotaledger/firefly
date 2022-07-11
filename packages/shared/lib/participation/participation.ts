import { IAccountState } from '@core/account'
import { DUST_THRESHOLD, hasValidPendingTransactions } from '../wallet'
import { canAccountReachMinimumAirdrop } from './staking'
import {
    isPerformingParticipation,
    participationAction,
    participationEvents,
    participationOverview,
    pendingParticipations,
} from './stores'
import { AccountParticipationAbility, ParticipationEventState, StakingAirdrop } from './types'

let participationPollInterval

/**
 * Begins polling of the participation overview.
 *
 * @method pollParticipationOverview
 *
 * @returns {Promise<void>}
 */
export function pollParticipationOverview(): void {
    clearPollParticipationOverviewInterval()
    try {
        // await getParticipationOverview(ASSEMBLY_EVENT_ID)
        // participationPollInterval = setInterval(
        //     async () => getParticipationOverview(ASSEMBLY_EVENT_ID),
        //     PARTICIPATION_POLL_DURATION
        // )
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
 * @param {IAccountState} account
 *
 * @returns {boolean}
 */
export const getAccountParticipationAbility = (account: IAccountState): AccountParticipationAbility => {
    if (Number(account?.balances.baseCoin.available) < DUST_THRESHOLD) {
        return AccountParticipationAbility.HasDustAmount
    } else if (hasValidPendingTransactions(account)) {
        return AccountParticipationAbility.HasPendingTransaction
    } else if (!canAccountReachMinimumAirdrop(account, StakingAirdrop.Assembly)) {
        return AccountParticipationAbility.WillNotReachMinAirdrop
    } else {
        return AccountParticipationAbility.Ok
    }
}
