import { isStrongholdUnlocked } from '@core/profile-manager'
import { closeOverlay, openOverlay, PopupId, popupState } from '@overlay'
import { get } from 'svelte/store'
import { handleError } from '@core/error/handlers/handleError'

export async function checkOrUnlockStronghold(
    callback: () => Promise<unknown> = async (): Promise<void> => {},
    reopenOverlay?: boolean
): Promise<unknown> {
    const previousPopup = get(popupState)
    function _callback(): Promise<unknown> {
        if (reopenOverlay) {
            openOverlay({ ...previousPopup, props: { ...previousPopup.props, _onMount: callback } })
        } else {
            return callback()
        }
    }
    try {
        const strongholdUnlocked = await isStrongholdUnlocked()
        if (strongholdUnlocked) {
            return callback()
        } else {
            closeOverlay(true)
            openOverlay({
                id: PopupId.UnlockStronghold,
                props: {
                    onSuccess: _callback,
                },
            })
        }
    } catch (err) {
        handleError(err)
    }
}
