import { get } from 'svelte/store'
import { selectedAccount, updateSelectedAccount } from '@core/account'
import { localize } from '@core/i18n'
import { NativeTokenOptions, TransactionOptions } from '@iota/wallet'
import { Converter } from '@core/utils'
import { showAppNotification } from '@auxiliary/notification'
import { activeProfile, ProfileType } from '@core/profile'
import { handleLedgerError } from '@core/ledger'
import { buildPersistedAssetFromIrc30Metadata } from '../helpers'
import { IIrc30Metadata, IPersistedAsset } from '../interfaces'
import { addActivityToAccountActivitiesInAllAccountActivities, resetMintTokenDetails } from '../stores'
import { addPersistedAsset } from '../stores/persisted-assets.store'
import { generateActivity, preprocessTransaction } from '../utils'
import { VerifiedStatus } from '../enums'

export async function mintNativeToken(
    maximumSupply: number,
    circulatingSupply: number,
    metadata: IIrc30Metadata
): Promise<void> {
    try {
        updateSelectedAccount({ isTransferring: true })
        const account = get(selectedAccount)

        const nativeTokenOptions: NativeTokenOptions = {
            maximumSupply: Converter.decimalToHex(maximumSupply, true),
            circulatingSupply: Converter.decimalToHex(circulatingSupply, true),
            foundryMetadata: Converter.utf8ToHex(JSON.stringify(metadata), true),
        }
        const transactionOptions: TransactionOptions = {
            remainderValueStrategy: { strategy: 'ReuseAddress', value: null },
        }
        const mintTokenTransaction = await account.mintNativeToken(nativeTokenOptions, transactionOptions)
        const persistedAsset: IPersistedAsset = buildPersistedAssetFromIrc30Metadata(
            mintTokenTransaction.tokenId,
            metadata,
            { verified: true, status: VerifiedStatus.SelfVerified }
        )
        const processedTransaction = await preprocessTransaction(mintTokenTransaction.transaction, account)
        addPersistedAsset(persistedAsset)
        addActivityToAccountActivitiesInAllAccountActivities(
            account.index,
            generateActivity(processedTransaction, account)
        )
        showAppNotification({
            type: 'success',
            message: localize('notifications.mintNativeToken.success'),
            alert: true,
        })
        resetMintTokenDetails()
        updateSelectedAccount({ isTransferring: false })
        return Promise.resolve()
    } catch (err) {
        updateSelectedAccount({ isTransferring: false })

        const _activeProfile = get(activeProfile)
        if (_activeProfile.type === ProfileType.Ledger) {
            handleLedgerError(err?.error)
        }

        return Promise.reject(err)
    }
}
