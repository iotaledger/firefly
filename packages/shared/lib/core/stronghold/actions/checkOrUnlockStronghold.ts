import { BaseError } from '@core/error'
import { isStrongholdUnlocked } from '@core/profile-manager'
import { openPopup, popupState } from '@lib/popup'
import { get } from 'svelte/store'

export async function checkOrUnlockStronghold(
    callback: () => Promise<unknown> = async () => {},
    reopenPopup?: boolean
): Promise<unknown> {
    const previousPopup = get(popupState)
    function _callback(): Promise<unknown> {
        if (reopenPopup) {
            openPopup({ ...previousPopup, props: { ...previousPopup.props, _onMount: callback } })
        } else {
            return callback()
        }
    }
    try {
        const strongholdUnlocked = await isStrongholdUnlocked()

        if (strongholdUnlocked) {
            return callback()
        } else {
            openPopup({
                type: 'unlockStronghold',
                props: {
                    onSuccess: _callback,
                },
            })
        }
    } catch (err) {
        new BaseError({ message: err.error ?? err.message, logToConsole: true })
    }
}
