import { get } from 'svelte/store'
import { localize } from '../i18n'
import { showAppNotification } from '../notifications'
import type { Event } from '../typings/events'
import { api, saveNewMessage } from '../wallet'
import { resetParticipation } from './participation'
import { addNewPendingParticipation, participationEvents, participationOverview } from './stores'
import type {
    ParticipateResponsePayload,
    Participation,
    ParticipationEvent,
    ParticipationOverviewResponse,
} from './types'
import { ParticipationAction } from './types'

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

                /* eslint-disable no-console */
                console.log('PARTICIPATION OVERVIEW:\n', get(participationOverview))

                resolve()
            },
            onError(error) {
                resetParticipation()
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

    /**
     * NOTE: This is to remove any old event IDs from testing. Accounts
     * may end up with straggling participation event IDs whenever switching
     * events with funds staked.
     */
    eventIds.push(
        'c87b676749ad07819ba70ce1cee6349f3740a38bf94e0ae5c198b6870c683661',
        '7991ace8e7b98d8120777a5889e4474f9499fdad88b8b69241d054d49272f0c7'
    )

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
