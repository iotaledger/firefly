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

export async function mintNft(metadata: IIrc27Metadata, amount: number): Promise<void> {
    try {
        const account = get(selectedAccount)
        updateSelectedAccount({ isTransferring: true })

        // Set NFT options
        const nftOptions: NftOptions = {
            issuer: account.depositAddress,
            immutableMetadata: Converter.utf8ToHex(JSON.stringify(metadata), true),
        }
        const allNfts: NftOptions[] = Array(amount).fill(nftOptions)

        // Mint NFT
        const mintNftTransaction = await account.mintNfts(allNfts, DEFAULT_TRANSACTION_OPTIONS)
        resetMintNftDetails()
        showAppNotification({
            type: 'success',
            message: localize('notifications.mintNft.success'),
            alert: true,
        })

        // Generate Activity
        const processedTransaction = await preprocessTransaction(mintNftTransaction, account)
        const activity: NftActivity = generateActivity(processedTransaction, account) as NftActivity
        addActivityToAccountActivitiesInAllAccountActivities(account.index, activity)

        // Store NFT
        const output = getNftOutputFromTransaction(processedTransaction.outputs)
        const nft = buildNftFromNftOutput(output.output as INftOutput, activity.outputId, false)
        addOrUpdateNftInAllAccountNfts(account.index, nft)

        return Promise.resolve()
    } catch (err) {
        const _activeProfile = get(activeProfile)
        if (_activeProfile.type === ProfileType.Ledger) {
            handleLedgerError(err?.error)
        }

        return Promise.reject(err)
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
