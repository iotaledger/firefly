import { writable } from 'svelte/store'

import { Electron, NativeProgress, VersionDetails } from '@lib/electron'
import { localize } from '@lib/i18n'
import {
    NOTIFICATION_TIMEOUT_NEVER,
    removeDisplayNotification,
    showAppNotification,
    updateDisplayNotification,
    updateDisplayNotificationProgress
} from '@lib/notifications'
import type { NotificationData } from '@lib/typings/notification'

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

Electron.onEvent('version-details', (nativeVersionDetails) => {
    versionDetails.set(nativeVersionDetails)
})

Electron.onEvent('version-progress', (nativeVersionProgress: NativeProgress) => {
    updateProgress.set(nativeVersionProgress.percent)

    const bytesRemaining = ((100 - nativeVersionProgress.percent) / 100) * nativeVersionProgress.total;
    if (nativeVersionProgress.bytesPerSecond > 0) {
        updateMinutesRemaining.set((bytesRemaining / nativeVersionProgress.bytesPerSecond) / 60)
    }
})

Electron.onEvent('version-complete', () => {
    updateBusy.set(false)
    updateError.set(false)
    updateComplete.set(true)
    updateMinutesRemaining.set(0)
})

Electron.onEvent('version-error', (nativeVersionError) => {
    console.log(nativeVersionError)
    updateError.set(true)
})

export function updateDownload(): void {
    updateProgress.set(0)
    updateMinutesRemaining.set(-1)
    updateBusy.set(true)
    updateComplete.set(false)
    updateError.set(false)

    let progressSubscription;
    let minutesRemainingSubscription;
    let completeSubscription;
    let errorSubscription;

    const cleanup = () => {
        removeDisplayNotification(notificationId)
        progressSubscription();
        completeSubscription();
        errorSubscription();
        minutesRemainingSubscription();
    }

    const downloadingNotification: NotificationData = {
        type: "info",
        message: localize('notifications.downloadingUpdate'),
        progress: 0,
        subMessage: localize('notifications.calcMinutesRemaining'),
        actions: [
            {
                label: localize('actions.cancel'),
                callback: () => {
                    updateCancel()
                    cleanup();
                }
            }
        ],
        timeout: NOTIFICATION_TIMEOUT_NEVER
    }

    const notificationId = showAppNotification(downloadingNotification)

    progressSubscription = updateProgress.subscribe(progress => {
        updateDisplayNotificationProgress(notificationId, progress);
    });

    minutesRemainingSubscription = updateMinutesRemaining.subscribe(minutesRemaining => {
        if (minutesRemaining > 0) {
            updateDisplayNotification(notificationId, {
                ...downloadingNotification,
                subMessage: minutesRemaining === -1
                    ? localize('notifications.calcMinutesRemaining')
                    : (minutesRemaining < 1 ? "< " : "")
                    + localize('notifications.minutesRemaining', {
                        values: {
                            minutes: Math.ceil(minutesRemaining).toString()
                        }
                    })
            });
        }
    });

    completeSubscription = updateComplete.subscribe((isComplete) => {
        if (isComplete) {
            updateDisplayNotification(
                notificationId,
                {
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
                            isPrimary: true
                        },
                        {
                            label: localize('actions.dismiss'),
                            callback: () => cleanup()
                        }
                    ]
                })
        }
    });

    errorSubscription = updateError.subscribe((isError) => {
        if (isError) {
            updateDisplayNotification(
                notificationId,
                {
                    ...downloadingNotification,
                    type: "error",
                    message: localize('notifications.updateError'),
                    progress: undefined,
                    actions: [
                        {
                            label: localize('actions.dismiss'),
                            callback: () => cleanup(),
                            isPrimary: true
                        }
                    ]
                })
        }
    });

    Electron.updateDownload()
}

export function updateCancel(): void {
    Electron.updateCancel()
    updateProgress.set(0)
    updateBusy.set(false)
    updateComplete.set(false)
    updateError.set(false)
    updateMinutesRemaining.set(-1)
}

export function updateInstall(): void {
    Electron.updateInstall()
}

export function updateCheck(): void {
    Electron.updateCheck()
}

export async function getVersionDetails(): Promise<void> {
    const verDetails = await Electron.getVersionDetails();
    versionDetails.set(verDetails)
}

export async function pollVersion(): Promise<void> {
    setInterval(async () => updateCheck(), DEFAULT_APP_UPDATER_POLL_INTERVAL)
}