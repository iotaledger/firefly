import { showAppNotification } from '@auxiliary/notification'
import { selectedAccount, updateSelectedAccount } from '@core/account'
import { localize } from '@core/i18n'
import { addOrUpdateNftInAllAccountNfts, buildNftFromNftOutput, IIrc27Metadata } from '@core/nfts'
import { Converter } from '@core/utils'
import { MintNftParams, OutputType, PreparedTransaction } from '@iota/sdk/out/types'
import { get } from 'svelte/store'
import { ActivityAction } from '../enums'
import { addActivityToAccountActivitiesInAllAccountActivities, resetMintNftDetails } from '../stores'
import { NftActivity } from '../types'
import { getDefaultTransactionOptions, preprocessOutgoingTransaction } from '../utils'
import { generateSingleNftActivity } from '../utils/generateActivity/generateSingleNftActivity'
import { plainToInstance } from 'class-transformer'

export async function mintNft(metadata: IIrc27Metadata, quantity: number): Promise<void> {
    try {
        const account = get(selectedAccount)
        updateSelectedAccount({ isTransferring: true })

        if (!account) return
        const mintNftParams: MintNftParams = {
            issuer: account.depositAddress,
            immutableMetadata: Converter.utf8ToHex(JSON.stringify(metadata)),
        }
        const allNftParams: MintNftParams[] = Array(quantity).fill(mintNftParams)

        // Mint NFT
        const mintNftTransaction = await account
            .prepareMintNfts(allNftParams, getDefaultTransactionOptions())
            .then((prepared) => plainToInstance(PreparedTransaction, prepared).send())
        resetMintNftDetails()
        showAppNotification({
            type: 'success',
            message: localize('notifications.mintNft.success'),
            alert: true,
        })

        const processedTransaction = await preprocessOutgoingTransaction(mintNftTransaction, account)
        const outputs = processedTransaction.outputs

        // Generate Activities
        for (const output of outputs) {
            if (output.output.type === OutputType.Nft) {
                // For each minted NFT, generate a new activity
                const activity: NftActivity = (await generateSingleNftActivity(account, {
                    action: ActivityAction.Mint,
                    processedTransaction,
                    wrappedOutput: output,
                })) as NftActivity
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
