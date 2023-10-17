import { get } from 'svelte/store'
import { showAppNotification } from '@auxiliary/notification'
import { selectedAccount, updateSelectedAccount } from '@core/account'
import { localize } from '@core/i18n'
import { Converter } from '@core/utils'
import { CreateNativeTokenParams, PreparedTransaction } from '@iota/sdk/out/types'
import { VerifiedStatus } from '../enums'
import { buildPersistedAssetFromMetadata } from '../helpers'
import { IIrc30Metadata, IPersistedAsset } from '../interfaces'
import { resetMintTokenDetails } from '../stores'
import { addPersistedAsset } from '../stores/persisted-assets.store'
import { plainToInstance } from 'class-transformer'
import { getDefaultTransactionOptions, processAndAddToActivities } from '../utils'

export async function createNativeToken(
    maximumSupply: number,
    circulatingSupply: number,
    metadata: IIrc30Metadata
): Promise<void> {
    try {
        updateSelectedAccount({ isTransferring: true })
        const account = get(selectedAccount)
        const params: CreateNativeTokenParams = {
            maximumSupply: BigInt(maximumSupply),
            circulatingSupply: BigInt(circulatingSupply),
            foundryMetadata: Converter.utf8ToHex(JSON.stringify(metadata)),
        }

        const preparedNativeTokenTransaction = await account?.prepareCreateNativeToken(
            params,
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

        await processAndAddToActivities(transaction, account)

        showAppNotification({
            type: 'success',
            message: localize('notifications.mintNativeToken.success'),
            alert: true,
        })
        resetMintTokenDetails()
    } catch (err) {
        return Promise.reject(err)
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
