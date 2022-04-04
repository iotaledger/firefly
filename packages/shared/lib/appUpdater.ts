import { Platform } from 'shared/lib/platform'
import { localize } from '@core/i18n'
import {
    NOTIFICATION_TIMEOUT_NEVER,
    removeDisplayNotification,
    showAppNotification,
    updateDisplayNotification,
    updateDisplayNotificationProgress,
} from 'shared/lib/notifications'
import { NotificationData } from 'shared/lib/typings/notification'
import { writable } from 'svelte/store'
import { NativeProgress, VersionDetails } from './typings/appUpdater'

const DEFAULT_APP_UPDATER_POLL_INTERVAL = 900000 // 15 Minutes

export const versionDetails = writable<VersionDetails>({
    upToDate: true,
    currentVersion: '',
    newVersion: '',
    newVersionReleaseDate: new Date(),
    changelog: '',
})

export const updateProgress = writable<number>(0)
export const updateMinutesRemaining = writable<number>(-1)
export const updateBusy = writable<boolean>(false)
export const updateComplete = writable<boolean>(false)
export const updateError = writable<boolean>(false)

Platform.onEvent('version-details', (nativeVersionDetails) => {
    versionDetails.set(nativeVersionDetails)
})

Platform.onEvent('version-progress', (nativeVersionProgress: NativeProgress) => {
    updateProgress.set(nativeVersionProgress.percent)

    const bytesRemaining = ((100 - nativeVersionProgress.percent) / 100) * nativeVersionProgress.total
    if (nativeVersionProgress.bytesPerSecond > 0) {
        updateMinutesRemaining.set(bytesRemaining / nativeVersionProgress.bytesPerSecond / 60)
    }
})

Platform.onEvent('version-complete', () => {
    updateBusy.set(false)
    updateError.set(false)
    updateComplete.set(true)
    updateMinutesRemaining.set(0)
})

Platform.onEvent('version-error', (nativeVersionError) => {
    console.error(nativeVersionError)
    updateError.set(true)
})

export function updateDownload(): void {
    updateProgress.set(0)
    updateMinutesRemaining.set(-1)
    updateBusy.set(true)
    updateComplete.set(false)
    updateError.set(false)

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
                    updateCancel()
                    cleanup()
                },
            },
        ],
        timeout: NOTIFICATION_TIMEOUT_NEVER,
    }

    const notificationId = showAppNotification(downloadingNotification)

    progressSubscription = updateProgress.subscribe((progress) => {
        updateDisplayNotificationProgress(notificationId, progress)
    })

    minutesRemainingSubscription = updateMinutesRemaining.subscribe((minutesRemaining) => {
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

    completeSubscription = updateComplete.subscribe((isComplete) => {
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
                            updateInstall()
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

    errorSubscription = updateError.subscribe((isError) => {
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

    void Platform.updateDownload()
}

export function updateCancel(): void {
    void Platform.updateCancel()

    updateProgress.set(0)
    updateBusy.set(false)
    updateComplete.set(false)
    updateError.set(false)
    updateMinutesRemaining.set(-1)
}

export function updateInstall(): void {
    void Platform.updateInstall()
}

export function updateCheck(): void {
    void Platform.updateCheck()
}

export async function getVersionDetails(): Promise<void> {
    const verDetails = await Platform.getVersionDetails()
    versionDetails.set(verDetails)
}

export function pollVersion(): void {
    setInterval(() => updateCheck(), DEFAULT_APP_UPDATER_POLL_INTERVAL)
}
