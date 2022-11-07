import { Platform } from '../classes'
import { IAppUpdateDownloadProgress } from '../interfaces'
import {
    appUpdateBusy,
    appUpdateComplete,
    appUpdateError,
    appUpdateMinutesRemaining,
    appUpdateProgress,
    appVersionDetails,
} from '../stores'

/**
 * Registers all event handlers for application updates.
 */
export function registerAppUpdateEvents(): void {
    Platform.onEvent('version-details', (nativeVersionDetails) => {
        appVersionDetails.set(nativeVersionDetails)
    })

    Platform.onEvent('version-progress', (appUpdateDownloadProgress: IAppUpdateDownloadProgress) => {
        appUpdateProgress.set(appUpdateDownloadProgress.percent)

        const bytesRemaining = ((100 - appUpdateDownloadProgress.percent) / 100) * appUpdateDownloadProgress.total
        if (appUpdateDownloadProgress.bytesPerSecond > 0) {
            appUpdateMinutesRemaining.set(bytesRemaining / appUpdateDownloadProgress.bytesPerSecond / 60)
        }
    })

    Platform.onEvent('version-complete', () => {
        appUpdateBusy.set(false)
        appUpdateError.set(false)
        appUpdateComplete.set(true)
        appUpdateMinutesRemaining.set(0)
    })

    Platform.onEvent('version-error', (nativeVersionError) => {
        console.error(nativeVersionError)
        appUpdateError.set(true)
    })
}
