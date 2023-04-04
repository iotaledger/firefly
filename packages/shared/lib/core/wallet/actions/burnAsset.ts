import { get } from 'svelte/store'
import { showAppNotification } from '@auxiliary/notification'
import { selectedAccount, updateSelectedAccount } from '@core/account/stores'
import { localize } from '@core/i18n'
import { Converter } from '@core/utils'
import { handleError } from '@core/error/handlers'
import { processAndAddToActivities } from '../utils'

export async function burnAsset(assetId: string, rawAmount: string): Promise<void> {
    const account = get(selectedAccount)
    try {
        updateSelectedAccount({ isTransferring: true })
        const burnTokenTransaction = await account.burnNativeToken(assetId, Converter.decimalToHex(Number(rawAmount)))

        await processAndAddToActivities(burnTokenTransaction, account)

        showAppNotification({
            type: 'success',
            message: localize('notifications.burnNativeToken.success'),
            alert: true,
        })
    } catch (err) {
        handleError(err)
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
