import { localize } from '@core/i18n'
import { isLedgerProfile } from '@core/profile'
import { isStrongholdUnlocked } from '@core/profile-manager'
import { get } from 'svelte/store'
import { showAppNotification } from './notifications'
import { openPopup, popupState } from './popup'

export async function checkStronghold(callback: () => unknown, reopenPopup?: boolean): Promise<unknown> {
    if (get(isLedgerProfile)) {
        showAppNotification({
            type: 'error',
            message: localize('error.ledger.noStronghold'),
        })

        return
    }

    try {
        const strongholdUnlocked = await isStrongholdUnlocked()
        if (strongholdUnlocked) {
            return callback()
        } else {
            if (reopenPopup) {
                const popup = get(popupState)
                openPasswordPopup(() => {
                    callback()
                    openPopup(popup)
                })
            } else {
                openPasswordPopup(callback)
            }
        }
    } catch (err) {
        console.error(err)
        showAppNotification({
            type: 'error',
            message: localize(err?.error),
        })
    }
}

function openPasswordPopup(onSuccess: () => unknown) {
    openPopup(
        {
            type: 'password',
            props: {
                onSuccess,
            },
        },
        true
    )
}
