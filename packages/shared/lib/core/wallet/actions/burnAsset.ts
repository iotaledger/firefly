import { PreparedTransaction } from '@iota/sdk/out/types'
import { plainToInstance } from 'class-transformer'

import { showAppNotification } from '@auxiliary/notification'
import { localize } from '@core/i18n'
import { handleError } from '@core/error/handlers'
import { processAndAddToActivities } from '../utils'
import { getSelectedWallet, updateSelectedWallet } from '../stores'

export async function burnAsset(assetId: string, rawAmount: string): Promise<void> {
    const wallet = getSelectedWallet()
    try {
        updateSelectedWallet({ isTransferring: true })
        const prepareBurnNativeTokenTransaction = await wallet?.prepareBurnNativeToken(assetId, BigInt(rawAmount))
        const preparedTransaction = plainToInstance(PreparedTransaction, prepareBurnNativeTokenTransaction)
        const burnTokenTransaction = await preparedTransaction?.send()

        await processAndAddToActivities(burnTokenTransaction, wallet)

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
