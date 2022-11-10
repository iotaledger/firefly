import { Platform } from '../classes'
import {
    appUpdateBusy,
    appUpdateComplete,
    appUpdateError,
    appUpdateMinutesRemaining,
    appUpdateProgress,
} from '../stores'

/**
 * Cancels the download of the application update.
 */
export function cancelAppUpdateDownload(): void {
    void Platform.cancelAppUpdateDownload()

    appUpdateProgress.set(0)
    appUpdateBusy.set(false)
    appUpdateComplete.set(false)
    appUpdateError.set(false)
    appUpdateMinutesRemaining.set(-1)
}
