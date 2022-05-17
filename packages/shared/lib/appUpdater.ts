import { Platform } from 'shared/lib/platform'
import { localize } from '@core/i18n'
import {
    NOTIFICATION_TIMEOUT_NEVER,
    removeDisplayNotification,
    showAppNotification,
    updateDisplayNotification,
    updateDisplayNotificationProgress,
} from '@lib/notifications'
import { NotificationData } from '@lib/typings/notification'

import {
    appUpdateBusy,
    appUpdateComplete,
    appUpdateError,
    appUpdateMinutesRemaining,
    appUpdateProgress,
    appVersionDetails,
    DEFAULT_APP_UPDATER_POLL_INTERVAL,
    IAppUpdateProgress,
    IAppVersionDetails,
} from '@core/app'

Platform.onEvent('get-app-version-details', (_appVersionDetails: IAppVersionDetails) => {
    appVersionDetails.set(_appVersionDetails)
})

Platform.onEvent('app-update-download-progress', (nativeVersionProgress: IAppUpdateProgress) => {
    appUpdateProgress.set(nativeVersionProgress.percent)

    const bytesRemaining = ((100 - nativeVersionProgress.percent) / 100) * nativeVersionProgress.total
    if (nativeVersionProgress.bytesPerSecond > 0) {
        appUpdateMinutesRemaining.set(bytesRemaining / nativeVersionProgress.bytesPerSecond / 60)
    }
})

Platform.onEvent('app-update-download-complete', () => {
    appUpdateBusy.set(false)
    appUpdateError.set(false)
    appUpdateComplete.set(true)
    appUpdateMinutesRemaining.set(0)
})

Platform.onEvent('app-update-error', (nativeVersionError) => {
    console.error(nativeVersionError)
    appUpdateError.set(true)
})

export async function getAppVersionDetails(): Promise<void> {
    const verDetails = await Platform.getAppVersionDetails()
    appVersionDetails.set(verDetails)
}

/**
 * Checks for updated Firefly versions at a specific time interval.
 */
export function pollCheckForAppUpdate(): void {
    setInterval(() => checkForAppUpdate(), DEFAULT_APP_UPDATER_POLL_INTERVAL)
}

/**
 *
 */
export function checkForAppUpdate(): void {
    void Platform.checkForAppUpdate()
}

export function downloadAppUpdate(): void {
    appUpdateProgress.set(0)
    appUpdateMinutesRemaining.set(-1)
    appUpdateBusy.set(true)
    appUpdateComplete.set(false)
    appUpdateError.set(false)

    let progressSubscription = null
    let minutesRemainingSubscription = null
    let completeSubscription = null
    let errorSubscription = null

    const cleanup = () => {
        removeDisplayNotification(notificationId)
        progressSubscription()
        completeSubscription()
        errorSubscription()
        minutesRemainingSubscription()
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
                    cancelAppUpdate()
                    cleanup()
                },
            },
        ],
        timeout: NOTIFICATION_TIMEOUT_NEVER,
    }

    const notificationId = showAppNotification(downloadingNotification)

    progressSubscription = appUpdateProgress.subscribe((progress) => {
        updateDisplayNotificationProgress(notificationId, progress)
    })

    minutesRemainingSubscription = appUpdateMinutesRemaining.subscribe((minutesRemaining) => {
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

    completeSubscription = appUpdateComplete.subscribe((isComplete) => {
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

    errorSubscription = appUpdateError.subscribe((isError) => {
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

    void Platform.downloadAppUpdate()
}

export function installAppUpdate(): void {
    void Platform.installAppUpdate()
}

export function cancelAppUpdate(): void {
    void Platform.cancelAppUpdate()

    appUpdateProgress.set(0)
    appUpdateBusy.set(false)
    appUpdateComplete.set(false)
    appUpdateError.set(false)
    appUpdateMinutesRemaining.set(-1)
}
