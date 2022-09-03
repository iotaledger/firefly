import { BaseError } from '@core/error'
import { activeProfile } from '@core/profile'
import { isStrongholdUnlocked } from '@core/profile-manager'
import { openPopup, popupState } from '@lib/popup'
import { get } from 'svelte/store'

export async function checkOrUnlockStronghold(
    callback: () => Promise<unknown> = async () => {},
    reopenPopup?: boolean
): Promise<unknown> {
    try {
        const strongholdUnlocked = await isStrongholdUnlocked()

        if (strongholdUnlocked) {
            return callback()
        } else {
            const popup = get(popupState)
            openPopup({ type: 'password' }, true)
            await isStrongholdUnlockedListener()
            if (reopenPopup) {
                openPopup({ ...popup, props: { ...popup.props, _onMount: callback } })
            } else {
                return callback()
            }
        }
    } catch (err) {
        new BaseError({ message: err.error ?? err.message, logToConsole: true })
    }
}

async function isStrongholdUnlockedListener(): Promise<boolean> {
    const { isStrongholdLocked } = get(activeProfile)
    return new Promise((resolve) => {
        isStrongholdLocked.subscribe((value) => {
            if (!value) {
                resolve(value)
            }
        })
    })
}
