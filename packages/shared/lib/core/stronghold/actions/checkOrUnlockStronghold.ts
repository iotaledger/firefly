import { closePopup, openPopup, PopupId, popupState } from '@auxiliary/popup'
import { get } from 'svelte/store'
import { handleError } from '@core/error/handlers/handleError'
import { IError } from '@core/error'
import { isStrongholdUnlocked } from '@core/wallet/actions'

export async function checkOrUnlockStronghold(
    callback: () => Promise<unknown> = async (): Promise<void> => {},
    reopenPopup?: boolean,
    cancelledCallback?: () => unknown
): Promise<unknown> {
    const previousPopup = get(popupState)

    function _callback(): Promise<unknown> | void {
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
            closePopup(true)
            openPopup({
                id: PopupId.UnlockStronghold,
                props: {
                    onSuccess: _callback,
                    onCancelled: cancelledCallback,
                },
            })
        }
    } catch (err) {
        handleError(err as unknown as IError)
    }
}
