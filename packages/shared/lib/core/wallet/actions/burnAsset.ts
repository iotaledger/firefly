import { PreparedTransaction } from '@iota/sdk/out/types'
import { plainToInstance } from 'class-transformer'

import { showAppNotification } from '@auxiliary/notification'
import { localize } from '@core/i18n'
import { Converter } from '@core/utils'
import { handleError } from '@core/error/handlers'
import { processAndAddToActivities } from '../utils'
import { getSelectedWallet, updateSelectedWallet } from '../stores'

export async function burnAsset(assetId: string, rawAmount: string): Promise<void> {
    const wallet = getSelectedWallet()
    try {
        updateSelectedWallet({ isTransferring: true })
        const prepareBurnNativeTokenTransaction = await wallet?.prepareBurnNativeToken(
            assetId,
            // TODO(2.0) Fix this
            Converter.decimalToHex(Number(rawAmount))
        )
        const preparedTransaction = plainToInstance(PreparedTransaction, prepareBurnNativeTokenTransaction)
        const burnTokenTransaction = await preparedTransaction?.send()

        await processAndAddToActivities(burnTokenTransaction, account)

        showAppNotification({
            type: 'success',
            message: localize('notifications.burnNativeToken.success'),
            alert: true,
        })
    } catch (err) {
        handleError(err)
    } finally {
        updateSelectedWallet({ isTransferring: false })
    }
}
