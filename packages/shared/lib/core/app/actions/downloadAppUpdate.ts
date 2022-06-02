import { localize } from '@core/i18n'
import {
    NOTIFICATION_TIMEOUT_NEVER,
    removeDisplayNotification,
    showAppNotification,
    updateDisplayNotification,
    updateDisplayNotificationProgress,
} from '@lib/notifications'
import { NotificationData } from '@lib/typings/notification'
import { Platform } from '@lib/platform'

import { installAppUpdate } from '../utils'
import {
    appUpdateBusy,
    appUpdateComplete,
    appUpdateError,
    appUpdateMinutesRemaining,
    appUpdateProgress,
} from '../stores'
import { cancelAppUpdateDownload } from './cancelAppUpdateDownload'

function resetAppUpdateStores(): void {
    appUpdateProgress.set(0)
    appUpdateMinutesRemaining.set(-1)
    appUpdateBusy.set(true)
    appUpdateComplete.set(false)
    appUpdateError.set(false)
}

/**
 * Initializes the download for an application update.
 */
export function downloadAppUpdate(): void {
    resetAppUpdateStores()

    const unsubscribeProgress = appUpdateProgress.subscribe((progress) => {
        updateDisplayNotificationProgress(notificationId, progress)
    })

    const unsubscribeMinutesRemaining = appUpdateMinutesRemaining.subscribe((minutesRemaining) => {
        if (minutesRemaining > 0) {
            updateDisplayNotification(notificationId, {
                ...downloadingNotification,
                subMessage:
                    minutesRemaining === -1
                        ? localize('notifications.calcMinutesRemaining')
                        : (minutesRemaining < 1 ? '< ' : '') +
                          localize('notifications.minutesRemaining', {
                              values: {
                                  minutes: Math.ceil(minutesRemaining).toString(),
                              },
                          }),
            })
        }
    })

    const unsubscribeUpdateComplete = appUpdateComplete.subscribe((isComplete) => {
        if (isComplete) {
            updateDisplayNotification(notificationId, {
                ...downloadingNotification,
                message: localize('notifications.updateReady'),
                subMessage: localize('notifications.restartInstall'),
                progress: undefined,
                actions: [
                    {
                        label: localize('actions.restartNow'),
                        callback: () => {
                            cleanup()
                            installAppUpdate()
                        },
                        isPrimary: true,
                    },
                    {
                        label: localize('actions.dismiss'),
                        callback: () => cleanup(),
                    },
                ],
            })
        }
    })

    const unsubscribeErrors = appUpdateError.subscribe((isError) => {
        if (isError) {
            updateDisplayNotification(notificationId, {
                ...downloadingNotification,
                type: 'error',
                message: localize('notifications.updateError'),
                progress: undefined,
                actions: [
                    {
                        label: localize('actions.dismiss'),
                        callback: () => cleanup(),
                        isPrimary: true,
                    },
                ],
            })
        }
    })

    const cleanup = () => {
        removeDisplayNotification(notificationId)

        unsubscribeProgress()
        unsubscribeUpdateComplete()
        unsubscribeErrors()
        unsubscribeMinutesRemaining()
    }

    const downloadingNotification: NotificationData = {
        type: 'info',
        message: localize('notifications.downloadingUpdate'),
        progress: 0,
        subMessage: localize('notifications.calcMinutesRemaining'),
        actions: [
            {
                label: localize('actions.cancel'),
                callback: () => {
                    cancelAppUpdateDownload()
                    cleanup()
                },
            },
        ],
        timeout: NOTIFICATION_TIMEOUT_NEVER,
    }

    const notificationId = showAppNotification(downloadingNotification)

    void Platform.downloadAppUpdate()
}
