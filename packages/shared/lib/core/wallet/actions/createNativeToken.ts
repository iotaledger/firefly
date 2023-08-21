import { get } from 'svelte/store'
import { showAppNotification } from '@auxiliary/notification'
import { selectedAccount, updateSelectedAccount } from '@core/account'
import { localize } from '@core/i18n'
import { Converter } from '@core/utils'
import { CreateNativeTokenParams } from '@iota/wallet'
import { DEFAULT_TRANSACTION_OPTIONS } from '../constants'
import { VerifiedStatus } from '../enums'
import { buildPersistedAssetFromMetadata } from '../helpers'
import { IIrc30Metadata, IPersistedAsset } from '../interfaces'
import { resetMintTokenDetails } from '../stores'
import { addPersistedAsset } from '../stores/persisted-assets.store'
import { processAndAddToActivities } from '../utils'

export async function createNativeToken(
    maximumSupply: number,
    circulatingSupply: number,
    metadata: IIrc30Metadata
): Promise<void> {
    try {
        updateSelectedAccount({ isTransferring: true })
        const account = get(selectedAccount)

        const params: CreateNativeTokenParams = {
            maximumSupply: Converter.decimalToHex(maximumSupply),
            circulatingSupply: Converter.decimalToHex(circulatingSupply),
            foundryMetadata: Converter.utf8ToHex(JSON.stringify(metadata)),
        }

        const createNativeTokenTransaction = await account.createNativeToken(params, DEFAULT_TRANSACTION_OPTIONS)
        const persistedAsset: IPersistedAsset = buildPersistedAssetFromMetadata(
            createNativeTokenTransaction.tokenId,
            metadata,
            { verified: true, status: VerifiedStatus.SelfVerified }
        )
        addPersistedAsset(persistedAsset)

        await processAndAddToActivities(createNativeTokenTransaction.transaction, account)

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
