import { showAppNotification } from '@auxiliary/notification'
import { selectedAccount, updateSelectedAccount } from '@core/account'
import { localize } from '@core/i18n'
import { handleLedgerError } from '@core/ledger'
import { addOrUpdateNftInAllAccountNfts, buildNftFromNftOutput, IIrc27Metadata } from '@core/nfts'
import { activeProfile, ProfileType } from '@core/profile'
import { Converter } from '@core/utils'
import { NftOptions } from '@iota/wallet'
import { get } from 'svelte/store'
import { DEFAULT_TRANSACTION_OPTIONS, OUTPUT_TYPE_NFT } from '../constants'
import { ActivityAction } from '../enums'
import { addActivityToAccountActivitiesInAllAccountActivities, resetMintNftDetails } from '../stores'
import { NftActivity } from '../types'
import { preprocessTransaction } from '../utils'
import { generateSingleNftActivity } from '../utils/generateActivity/generateSingleNftActivity'

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

        const processedTransaction = await preprocessTransaction(mintNftTransaction, account)
        const outputs = processedTransaction.outputs

        // Generate Activities
        for (const output of outputs) {
            if (output.output.type === OUTPUT_TYPE_NFT) {
                // For each minted NFT, generate a new activity
                const activity: NftActivity = generateSingleNftActivity(account, {
                    action: ActivityAction.Mint,
                    processedTransaction,
                    wrappedOutput: output,
                }) as NftActivity
                addActivityToAccountActivitiesInAllAccountActivities(account.index, activity)

                // Store NFT metadata for each minted NFT
                const nft = buildNftFromNftOutput(output.output, activity.outputId, false)
                addOrUpdateNftInAllAccountNfts(account.index, nft)
            }
        }

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
