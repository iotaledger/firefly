import { showAppNotification } from '@auxiliary/notification'
import { selectedAccount, updateSelectedAccount } from '@core/account'
import { localize } from '@core/i18n'
import { addOrUpdateNftInAllAccountNfts, buildNftFromNftOutput, IIrc27Metadata } from '@core/nfts'
import { Converter } from '@core/utils'
import { MintNftParams } from '@iota/wallet'
import { get } from 'svelte/store'
import { DEFAULT_TRANSACTION_OPTIONS, OUTPUT_TYPE_NFT } from '../constants'
import { ActivityAction } from '../enums'
import { addActivityToAccountActivitiesInAllAccountActivities, resetMintNftDetails } from '../stores'
import { NftActivity } from '../types'
import { preprocessTransaction } from '../utils'
import { generateSingleNftActivity } from '../utils/generateActivity/generateSingleNftActivity'

export async function mintNft(metadata: IIrc27Metadata, quantity: number): Promise<void> {
    try {
        const account = get(selectedAccount)
        updateSelectedAccount({ isTransferring: true })

        const mintNftParams: MintNftParams = {
            issuer: account.depositAddress,
            immutableMetadata: Converter.utf8ToHex(JSON.stringify(metadata)),
        }
        const allNftParams: MintNftParams[] = Array(quantity).fill(mintNftParams)

        // Mint NFT
        const mintNftTransaction = await account.mintNfts(allNftParams, DEFAULT_TRANSACTION_OPTIONS)
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
                const nft = buildNftFromNftOutput(output, account.depositAddress, false)
                addOrUpdateNftInAllAccountNfts(account.index, nft)
            }
        }
    } catch (err) {
        return Promise.reject(err)
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
