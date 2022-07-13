import { BaseError } from '@core/error'
import { localize } from '@core/i18n'
import { activeProfile, isLedgerProfile } from '@core/profile'
import { isStrongholdUnlocked } from '@core/profile-manager'
import { get } from 'svelte/store'
import { showAppNotification } from './notifications'
import { openPopup, popupState } from './popup'

export async function checkStronghold(
    callback: () => Promise<unknown> = async () => {},
    reopenPopup?: boolean
): Promise<unknown> {
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
        new BaseError({ message: err.error ?? err.message, logError: true })
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
