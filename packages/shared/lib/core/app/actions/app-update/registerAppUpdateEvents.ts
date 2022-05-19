import { Platform } from '@lib/platform'
import { AppUpdateDownloadProgress } from '../../interfaces'
import {
    updateBusy,
    updateComplete,
    updateError,
    updateMinutesRemaining,
    updateProgress,
    versionDetails,
} from '../../stores'

export function registerAppUpdateEvents(): void {
    Platform.onEvent('version-details', (nativeVersionDetails) => {
        versionDetails.set(nativeVersionDetails)
    })

    Platform.onEvent('version-progress', (appUpdateDownloadProgress: AppUpdateDownloadProgress) => {
        updateProgress.set(appUpdateDownloadProgress.percent)

        const bytesRemaining = ((100 - appUpdateDownloadProgress.percent) / 100) * appUpdateDownloadProgress.total
        if (appUpdateDownloadProgress.bytesPerSecond > 0) {
            updateMinutesRemaining.set(bytesRemaining / appUpdateDownloadProgress.bytesPerSecond / 60)
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
}
