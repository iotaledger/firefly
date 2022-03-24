import { localize } from '@core/i18n'

import { Event } from '../typings/events'
import { showAppNotification } from '../notifications'
import { api, saveNewMessage } from '../wallet'
import { addNewPendingParticipation, participationEvents, participationOverview, participationHistory } from './stores'
import {
    ParticipationAction,
    ParticipateResponsePayload,
    Participation,
    ParticipationEvent,
    ParticipationOverviewResponse,
    ParticipationHistoryItem,
} from './types'

export function getParticipationOverview(): Promise<void> {
    return new Promise((resolve, reject) => {
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

export function getParticipationEvents(): Promise<ParticipationEvent[]> {
    return new Promise((resolve, reject) => {
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

export function participate(
    accountId: string,
    participations: Participation[],
    action: ParticipationAction
): Promise<string[]> {
    if (!accountId) {
        showAppNotification({
            type: 'error',
            message: localize('error.participation.cannotUseAccount'),
        })
        return
    }

    return new Promise((resolve, reject) => {
        api.participate(accountId, participations, {
            onSuccess(response: Event<ParticipateResponsePayload>) {
                response.payload.forEach((message) => saveNewMessage(accountId, message))
                const participationHistoryItems: ParticipationHistoryItem[] = response.payload.map((message) => ({ messageId: message.id, accountId, action, eventId: participations[0]?.eventId }))
                participationHistory.update((_participationHistory) => [
                    ..._participationHistory,
                    ...participationHistoryItems,
                ])

                addNewPendingParticipation(response.payload, accountId, action)
                resolve(response.payload.map((message) => message.id))
            },
            onError(error) {
                console.error(error)

                reject(error)
            },
        })
    })
}

export function stopParticipating(
    accountId: string,
    eventIds: string[],
    action: ParticipationAction
): Promise<string[]> {
    if (!accountId) {
        showAppNotification({
            type: 'error',
            message: localize('error.participation.cannotUseAccount'),
        })

        return
    }

    return new Promise((resolve, reject) => {
        api.stopParticipating(accountId, eventIds, {
            onSuccess(response: Event<ParticipateResponsePayload>) {
                response.payload.forEach((message) => saveNewMessage(accountId, message))

                addNewPendingParticipation(response.payload, accountId, action)

                resolve(response.payload.map((message) => message.id))
            },
            onError(error) {
                console.error(error)

                reject(error)
            },
        })
    })
}
