import { showAppNotification } from '@auxiliary/notification'
import { selectedAccount } from '@core/account/stores/selected-account.store'
import { handleError } from '@core/error/handlers/handleError'
import { localize } from '@core/i18n'
import { handleLedgerError } from '@core/ledger'
import { activeProfile, ProfileType } from '@core/profile'
import { get } from 'svelte/store'

export async function burnAsset(assetId: string, rawAmount: string): Promise<void> {
    const account = get(selectedAccount)
    const _activeProfile = get(activeProfile)
    try {
        await account.burnNativeToken(assetId, '0x' + Number(rawAmount).toString(16))

        showAppNotification({
            type: 'success',
            message: localize('notifications.burnNativeToken.success'),
            alert: true,
        })
    } catch (err) {
        if (_activeProfile.type === ProfileType.Ledger) {
            handleLedgerError(err.error)
        } else {
            handleError(err)
        }
    }
}
