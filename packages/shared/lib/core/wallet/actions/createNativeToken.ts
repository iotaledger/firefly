import { showAppNotification } from '@auxiliary/notification'
import { localize } from '@core/i18n'
import { PreparedTransaction } from '@iota/sdk/out/types'
import { VerifiedStatus } from '../enums'
import { buildPersistedAssetFromMetadata } from '../helpers'
import { IIrc30Metadata, IPersistedAsset } from '../interfaces'
import { getSelectedWallet, resetMintTokenDetails, updateSelectedWallet } from '../stores'
import { addPersistedAsset } from '../stores/persisted-assets.store'
import { plainToInstance } from 'class-transformer'
import { processAndAddToActivities } from '../utils'
import { prepareCreateNativeToken } from './prepareCreateNativeToken'

export async function createNativeToken(
    maximumSupply: number,
    circulatingSupply: number,
    metadata: IIrc30Metadata
): Promise<void> {
    try {
        updateSelectedWallet({ isTransferring: true })
        const wallet = getSelectedWallet()
        const preparedNativeTokenTransaction = await prepareCreateNativeToken(
            maximumSupply,
            circulatingSupply,
            metadata
        )
        if (!preparedNativeTokenTransaction) return
        const preparedTransaction = plainToInstance(PreparedTransaction, preparedNativeTokenTransaction)
        const transaction = await preparedTransaction?.send()
        const persistedAsset: IPersistedAsset = buildPersistedAssetFromMetadata(
            preparedNativeTokenTransaction._tokenId,
            metadata,
            { verified: true, status: VerifiedStatus.SelfVerified }
        )
        addPersistedAsset(persistedAsset)

        await processAndAddToActivities(transaction, wallet)

        showAppNotification({
            type: 'success',
            message: localize('notifications.mintNativeToken.success'),
            alert: true,
        })
        resetMintTokenDetails()
    } catch (err) {
        return Promise.reject(err)
    } finally {
        updateSelectedWallet({ isTransferring: false })
    }
}
