import { DUST_THRESHOLD } from '../wallet'
import type { WalletAccount } from '../typings/wallet'

import { getParticipationOverview } from './api'
import { PARTICIPATION_POLL_DURATION } from './constants'
import { participationEvents, participationOverview } from './stores'
import { ParticipationEventState } from './types'

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
        PARTICIPATION_POLL_DURATION
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
