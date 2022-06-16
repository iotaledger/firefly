import { localize } from '@core/i18n'
import { isLedgerProfile } from '@core/profile'
import { isStrongholdUnlocked } from '@core/profile-manager'
import { get } from 'svelte/store'
import { showAppNotification } from './notifications'
import { openPopup } from './popup'

export async function checkStronghold(callback: () => unknown): Promise<void> {
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
            callback()
        } else {
            openPopup(
                {
                    type: 'password',
                    props: {
                        onSuccess: callback,
                    },
                },
                true
            )
        }
    } catch (err) {
        console.error(err)
        showAppNotification({
            type: 'error',
            message: localize(err?.error),
        })
    }
}
