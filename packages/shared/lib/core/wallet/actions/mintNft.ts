import { showAppNotification } from '@auxiliary/notification'
import { selectedAccount, updateSelectedAccount } from '@core/account'
import { localize } from '@core/i18n'
import { handleLedgerError } from '@core/ledger'
import { addOrUpdateNftInAllAccountNfts, buildNftFromNftOutput, IIrc27Metadata } from '@core/nfts'
import { activeProfile, ProfileType } from '@core/profile'
import { Converter } from '@core/utils'
import { INftOutput } from '@iota/types'
import { NftOptions } from '@iota/wallet'
import { get } from 'svelte/store'
import { DEFAULT_TRANSACTION_OPTIONS } from '../constants'
import { addActivityToAccountActivitiesInAllAccountActivities, resetMintNftDetails } from '../stores'
import { NftActivity } from '../types'
import { getNftOutputFromTransaction, preprocessTransaction } from '../utils'
import { generateActivity } from '../utils/generateActivity'

export async function mintNft(metadata: IIrc27Metadata): Promise<void> {
    try {
        const account = get(selectedAccount)
        updateSelectedAccount({ isTransferring: true })

        // Set NFT options
        const nftOptions: NftOptions = {
            issuer: account.depositAddress,
            immutableMetadata: Converter.utf8ToHex(JSON.stringify(metadata), true),
        }

        // Mint NFT
        const mintNftTransaction = await account.mintNfts([nftOptions], DEFAULT_TRANSACTION_OPTIONS)
        resetMintNftDetails()
        showAppNotification({
            type: 'success',
            message: localize('notifications.mintNft.success'),
            alert: true,
        })

        // Generate Activity
        const processedTransaction = preprocessTransaction(mintNftTransaction)
        const activity: NftActivity = generateActivity(processedTransaction, account) as NftActivity
        addActivityToAccountActivitiesInAllAccountActivities(account.index, activity)

        // Store NFT
        const output = getNftOutputFromTransaction(processedTransaction.outputs)
        const nft = buildNftFromNftOutput(output.output as INftOutput, activity.outputId, true)
        addOrUpdateNftInAllAccountNfts(account.index, nft)

        return Promise.resolve()
    } catch (reason) {
        const _activeProfile = get(activeProfile)
        if (_activeProfile.type === ProfileType.Ledger) {
            handleLedgerError(reason.error)
        }

        return Promise.reject(reason)
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
