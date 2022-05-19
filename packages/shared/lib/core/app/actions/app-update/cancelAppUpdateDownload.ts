import { Platform } from '@lib/platform'

import { updateBusy, updateComplete, updateError, updateMinutesRemaining, updateProgress } from '../../stores'

export function cancelAppUpdateDownload(): void {
    void Platform.cancelAppUpdateDownload()

    updateProgress.set(0)
    updateBusy.set(false)
    updateComplete.set(false)
    updateError.set(false)
    updateMinutesRemaining.set(-1)
}
