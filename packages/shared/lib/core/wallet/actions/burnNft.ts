import { PreparedTransaction } from '@iota/sdk/out/types'
import { plainToInstance } from 'class-transformer'

import { showAppNotification } from '@auxiliary/notification'
import { getSelectedWallet, updateSelectedWallet } from '@core/wallet/stores/selected-wallet.store'
import { localize } from '@core/i18n'
import { updateNftInAllWalletNfts } from '@core/nfts'
import { handleError } from '@core/error/handlers'

// TODO(2.0) Fix all usages
export async function burnNft(nftId: string): Promise<void> {
    const wallet = getSelectedWallet()
    try {
        updateSelectedWallet({ isTransferring: true })
        const prepareBurnNftTransaction = await wallet?.prepareBurnNft(nftId)
        const preparedTransaction = plainToInstance(PreparedTransaction, prepareBurnNftTransaction)
        const burnNftTransaction = await preparedTransaction?.send()

        // Update NFT
        updateNftInAllWalletNfts(wallet.id, nftId, { isSpendable: false })

        showAppNotification({
            type: 'success',
            message: localize('notifications.burnNft.success'),
            alert: true,
        })
    } catch (err) {
        handleError(err)
        throw err
    } finally {
        updateSelectedWallet({ isTransferring: false })
    }
}
