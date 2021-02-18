import { get, writable } from 'svelte/store'
import {
    showAppNotification,
    removeDisplayNotification,
    updateDisplayNotificationProgress,
    updateDisplayNotification,
    NOTIFICATION_TIMEOUT_NEVER,
    NotificationData
} from 'shared/lib/notifications'
import { _ } from 'shared/lib/i18n'

type VersionDetails = {
    upToDate: boolean
    currentVersion: string
    newVersion: string
    newVersionReleaseDate: Date
    changelog: string
}

type NativeProgress = {
    total: number
    delta: number
    transferred: number
    percent: number
    bytesPerSecond: number
}

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

window['Electron'].onEvent('version-details', (nativeVersionDetails) => {
    versionDetails.set(nativeVersionDetails)
})

window['Electron'].onEvent('version-progress', (nativeVersionProgress: NativeProgress) => {
    updateProgress.set(nativeVersionProgress.percent)

    const bytesRemaining = ((100 - nativeVersionProgress.percent) / 100) * nativeVersionProgress.total;
    if (nativeVersionProgress.bytesPerSecond > 0) {
        updateMinutesRemaining.set((bytesRemaining / nativeVersionProgress.bytesPerSecond) / 60)
    }
})

window['Electron'].onEvent('version-complete', (nativeVersionComplete) => {
    updateBusy.set(false)
    updateError.set(false)
    updateComplete.set(true)
    updateMinutesRemaining.set(0)
})

window['Electron'].onEvent('version-error', (nativeVersionError) => {
    console.log(nativeVersionError)
    updateError.set(true)
})

export function updateDownload(): void {
    updateProgress.set(0)
    updateMinutesRemaining.set(-1)
    updateBusy.set(true)
    updateComplete.set(false)
    updateError.set(false)

    const locale = get(_) as (string, values?) => string

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
        message: locale('notifications.downloading_update'),
        progress: 0,
        subMessage: locale('notifications.calc_minutes_remaining'),
        actions: [
            {
                label: locale('actions.cancel'),
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
                    ? locale('notifications.calc_minutes_remaining')
                    : (minutesRemaining < 1 ? "< " : "")
                    + locale('notifications.minutes_remaining', {
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
                    type: "info",
                    message: locale('notifications.update_ready'),
                    subMessage: locale('notifications.restart_install'),
                    progress: undefined,
                    actions: [
                        {
                            label: locale('actions.restart_now'),
                            callback: () => {
                                cleanup()
                                updateInstall()
                            },
                            isPrimary: true
                        },
                        {
                            label: locale('actions.dismiss'),
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
                    type: "error",
                    message: locale('notifications.update_error'),
                    progress: undefined,
                    actions: [
                        {
                            label: locale('actions.dismiss'),
                            callback: () => cleanup(),
                            isPrimary: true
                        }
                    ]
                })
        }
    });

    window['Electron'].updateDownload()
}

export function updateCancel(): void {
    window['Electron'].updateCancel()
    updateProgress.set(0)
    updateBusy.set(false)
    updateComplete.set(false)
    updateError.set(false)
    updateMinutesRemaining.set(-1)
}

export function updateInstall(): void {
    window['Electron'].updateInstall()
}

export async function refreshVersionDetails(): Promise<void> {
    const verDetails = await window['Electron'].getVersionDetails();
    console.log(verDetails);
    versionDetails.set(verDetails)
}
