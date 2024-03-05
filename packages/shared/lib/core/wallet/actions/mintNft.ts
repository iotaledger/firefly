import { showAppNotification } from '@auxiliary/notification'
import { localize } from '@core/i18n'
import { addOrUpdateNftInAllWalletNfts, buildNftFromNftOutput, IIrc27Metadata } from '@core/nfts'
import { Converter } from '@core/utils'
import { Bech32Address, MetadataFeature, MintNftParams, OutputType } from '@iota/sdk/out/types'
import { ActivityAction } from '../enums'
import {
    addActivityToWalletActivitiesInAllWalletActivities,
    getSelectedWallet,
    resetMintNftDetails,
    updateSelectedWallet,
} from '../stores'
import { NftActivity } from '../types'
import { getDefaultTransactionOptions, preprocessOutgoingTransaction } from '../utils'
import { generateSingleNftActivity } from '../utils/generateActivity/generateSingleNftActivity'
import { DEFAULT_METADATA_FEATURE_ENTRY_KEY } from '../constants'

// TODO: Update this temporary interface when fixed in the SDK, linked issue https://github.com/iotaledger/firefly/issues/8134
interface MintNftParamsTemp {
    issuer: Bech32Address
    address: Bech32Address
    immutableMetadata: MetadataFeature
}

export async function mintNft(metadata: IIrc27Metadata, quantity: number): Promise<void> {
    try {
        const wallet = getSelectedWallet()
        updateSelectedWallet({ isTransferring: true })

        if (!wallet) return
        const mintNftParams: MintNftParamsTemp = {
            issuer: wallet.depositAddress,
            address: wallet.depositAddress,
            immutableMetadata: new MetadataFeature({
                [DEFAULT_METADATA_FEATURE_ENTRY_KEY]: Converter.utf8ToHex(JSON.stringify(metadata)),
            }),
        }

        const allNftParams: MintNftParams[] = Array(quantity).fill(mintNftParams)

        // Mint NFT
        const mintNftTransaction = await wallet.mintNfts(allNftParams, getDefaultTransactionOptions())
        resetMintNftDetails()
        showAppNotification({
            type: 'success',
            message: localize('notifications.mintNft.success'),
            alert: true,
        })

        const processedTransaction = await preprocessOutgoingTransaction(mintNftTransaction, wallet)
        const outputs = processedTransaction.outputs

        // Generate Activities
        for (const output of outputs) {
            if (output.output.type === OutputType.Nft) {
                // For each minted NFT, generate a new activity
                const activity: NftActivity = (await generateSingleNftActivity(wallet, {
                    action: ActivityAction.Mint,
                    processedTransaction,
                    wrappedOutput: output,
                })) as NftActivity
                addActivityToWalletActivitiesInAllWalletActivities(wallet.id, activity)

                // Store NFT metadata for each minted NFT
                const nft = buildNftFromNftOutput(output, wallet.depositAddress, false)
                addOrUpdateNftInAllWalletNfts(wallet.id, nft)
            }
        }
    } catch (err) {
        return Promise.reject(err)
    } finally {
        updateSelectedWallet({ isTransferring: false })
    }
}
