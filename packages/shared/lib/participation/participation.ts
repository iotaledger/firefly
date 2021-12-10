import { toHexString } from '../utils'
import { DUST_THRESHOLD } from '../wallet'
import type { WalletAccount } from '../typings/wallet'

import { getParticipationOverview } from './api'
import { PARTICIPATION_POLL_DURATION } from './constants'
import { accountToParticipate, participationAction, participationEvents, participationOverview } from './stores'
import { ParticipationEventState, Participation } from './types'

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
    participationPollInterval = setInterval(async () => getParticipationOverview(), PARTICIPATION_POLL_DURATION)
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
    participationAction.set(null)
    participationEvents.set([])
    participationOverview.set([])
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
 * Extracts participations from indexation payload
 * First byte is participations length;
 * Next 32 bytes are event id;
 * Next byte is answers count;
 * The next (n = answer count) bytes are answers
 *
 * @method extractParticipations
 *
 * @param {number[]} array — Indexation payload data
 *
 * @returns {Participation[]}
 */
function extractParticipations(array: number[]): Participation[] {
    const eventIdBytes = 32

    // First byte is participation count
    const participationCount = array[0]

    const _participations = []

    // Start from the second (index = 1) byte
    let startByteIndex = 1

    Array.from({ length: participationCount }).forEach(() => {
        // Extract event id
        const eventId = toHexString(array.slice(startByteIndex, startByteIndex + eventIdBytes))

        // Increment the byte index
        startByteIndex += eventIdBytes

        const answersCount = array[startByteIndex]

        startByteIndex++

        // Extract answers
        const answers = []
        Array.from({ length: answersCount }).forEach((_, idx) => answers.push(array[startByteIndex + idx]))

        _participations.push({
            eventId,
            answers,
        })

        startByteIndex += answersCount
    })

    return _participations
}
