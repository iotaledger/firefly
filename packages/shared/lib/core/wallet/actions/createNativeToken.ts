import { showAppNotification } from '@auxiliary/notification'
import { localize } from '@core/i18n'
import { Converter } from '@core/utils'
import { AccountId, CreateNativeTokenParams, MetadataFeature, PreparedTransaction, u256 } from '@iota/sdk/out/types'
import { VerifiedStatus } from '../enums'
import { buildPersistedAssetFromMetadata } from '../helpers'
import { IIrc30Metadata, IPersistedAsset } from '../interfaces'
import { getSelectedWallet, resetMintTokenDetails, updateSelectedWallet } from '../stores'
import { addPersistedAsset } from '../stores/persisted-assets.store'
import { plainToInstance } from 'class-transformer'
import { getDefaultTransactionOptions, processAndAddToActivities } from '../utils'
import { DEFAULT_METADATA_FEATURE_ENTRY_KEY } from '../constants'

// TODO: Remove temporary interface
interface CreateNativeTokenParamsTemp {
    accountId?: AccountId
    circulatingSupply: u256
    maximumSupply: u256
    foundryMetadata?: MetadataFeature
}

export async function createNativeToken(
    maximumSupply: number,
    circulatingSupply: number,
    metadata: IIrc30Metadata
): Promise<void> {
    try {
        updateSelectedWallet({ isTransferring: true })
        const wallet = getSelectedWallet()
        const params: CreateNativeTokenParamsTemp = {
            maximumSupply: BigInt(maximumSupply),
            circulatingSupply: BigInt(circulatingSupply),
            foundryMetadata: new MetadataFeature({
                [DEFAULT_METADATA_FEATURE_ENTRY_KEY]: Converter.utf8ToHex(JSON.stringify(metadata)),
            }),
        }

        const preparedNativeTokenTransaction = await wallet?.prepareCreateNativeToken(
            params as CreateNativeTokenParams,
            getDefaultTransactionOptions()
        )
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
