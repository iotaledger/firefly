import { PreparedTransaction } from '@iota/sdk/out/types'
import { plainToInstance } from 'class-transformer'

import { showAppNotification } from '@auxiliary/notification'
import { getSelectedWallet, updateSelectedWallet } from '@core/wallet/stores/selected-wallet.store'
import { localize } from '@core/i18n'
import { updateNftInAllAccountNfts } from '@core/nfts'
import { handleError } from '@core/error/handlers'
import { processAndAddToActivities } from '../utils'

// TODO(2.0) Fix all usages
export async function burnNft(nftId: string): Promise<void> {
    const wallet = getSelectedWallet();
    try {
        updateSelectedWallet({ isTransferring: true })
        const prepareBurnNftTransaction = await wallet?.prepareBurnNft(nftId)
        const preparedTransaction = plainToInstance(PreparedTransaction, prepareBurnNftTransaction)
        const burnNftTransaction = await preparedTransaction?.send()

        // Generate Activity
        await processAndAddToActivities(burnNftTransaction, wallet)

        // Update NFT
        updateNftInAllAccountNfts(wallet.id, nftId, { isSpendable: false })

        showAppNotification({
            type: 'success',
            message: localize('notifications.burnNft.success'),
            alert: true,
        })
    } catch (err) {
        handleError(err)
        throw err
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
