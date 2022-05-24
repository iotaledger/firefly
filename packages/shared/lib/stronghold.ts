import { get } from 'svelte/store'

import { openPopup } from './popup'
import { api } from './wallet'
import { Event } from './typings/events'
import { StrongholdStatus } from './typings/wallet'
import { showAppNotification } from './notifications'
import { localize } from '@core/i18n'
import { isLedgerProfile } from '@core/profile'
import { isStrongholdUnlocked } from '@core/profile-manager'

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const checkStronghold = (callback: any): void => {
    if (get(isLedgerProfile)) {
        showAppNotification({
            type: 'error',
            message: localize('error.ledger.noStronghold'),
        })

        return
    }

    isStrongholdUnlocked()
        .then((response) => {
            if (!response) {
                openPopup(
                    {
                        type: 'password',
                        props: {
                            onSuccess: callback,
                        },
                    },
                    true
                )
            } else {
                callback()
            }
        })
        .catch((err) => {
            console.error(err)
            showAppNotification({
                type: 'error',
                message: localize(err?.error),
            })
        })
}
