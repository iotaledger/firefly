import { localize } from '@core/i18n'

import { Event } from '../typings/events'
import { showAppNotification } from '../notifications'
import { api, saveNewMessage } from '../wallet'
import { addNewPendingParticipation, participationEvents, participationOverview } from './stores'
import {
    ParticipationAction,
    ParticipateResponsePayload,
    Participation,
    ParticipationEvent,
    ParticipationOverviewResponse,
} from './types'

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

                resolve()
            },
            onError(error) {
                console.error(error)

                reject(error)
            },
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

                resolve(response?.payload)
            },
            onError(error) {
                console.error(error)

                reject(error)
            },
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
export function participate(accountId: string, participations: Participation[]): Promise<string[]> {
    if (!accountId) {
        showAppNotification({
            type: 'error',
            message: localize('error.participation.cannotUseAccount'),
        })

        return
    }

    return new Promise<string[]>((resolve, reject) => {
        api.participate(accountId, participations, {
            onSuccess(response: Event<ParticipateResponsePayload>) {
                response.payload.forEach((message) => saveNewMessage(accountId, message))

                addNewPendingParticipation(response.payload, accountId, ParticipationAction.Stake)
                resolve(response.payload.map((message) => message.id))
            },
            onError(error) {
                console.error(error)

                reject(error)
            },
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
export function stopParticipating(accountId: string, eventIds: string[]): Promise<string[]> {
    if (!accountId) {
        showAppNotification({
            type: 'error',
            message: localize('error.participation.cannotUseAccount'),
        })

        return
    }

    return new Promise<string[]>((resolve, reject) => {
        api.stopParticipating(accountId, eventIds, {
            onSuccess(response: Event<ParticipateResponsePayload>) {
                response.payload.forEach((message) => saveNewMessage(accountId, message))

                addNewPendingParticipation(response.payload, accountId, ParticipationAction.Unstake)

                resolve(response.payload.map((message) => message.id))
            },
            onError(error) {
                console.error(error)

                reject(error)
            },
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
export function participateWithRemainingFunds(accountId: string, participations: Participation[]): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        api.participateWithRemainingFunds(accountId, participations, {
            onSuccess(response: Event<ParticipateResponsePayload>) {
                response.payload.forEach((message) => saveNewMessage(accountId, message))

                addNewPendingParticipation(response.payload, accountId, ParticipationAction.Stake)

                resolve(response.payload.map((message) => message.id))
            },
            onError(error) {
                console.error(error)

                reject(error)
            },
        })
    })
}
