import { showAppNotification } from '@auxiliary/notification'
import { localize } from '@core/i18n'
import { addOrUpdateNftInAllWalletNfts, buildNftFromNftOutput, IIrc27Metadata } from '@core/nfts'
import { Converter } from '@core/utils'
import { MintNftParams, OutputType, PreparedTransaction } from '@iota/sdk/out/types'
import { ActivityAction } from '../enums'
import {
    getSelectedWallet,
    resetMintNftDetails,
    updateSelectedWallet,
} from '../stores'
import { ActivityNft } from '../types'
import { getDefaultTransactionOptions, preprocessOutgoingTransaction } from '../utils'
import { plainToInstance } from 'class-transformer'

export async function mintNft(metadata: IIrc27Metadata, quantity: number): Promise<void> {
    try {
        const wallet = getSelectedWallet()
        updateSelectedWallet({ isTransferring: true })

        if (!wallet) return
        const mintNftParams: MintNftParams = {
            issuer: wallet.depositAddress,
            immutableMetadata: Converter.utf8ToHex(JSON.stringify(metadata)),
        }
        const allNftParams: MintNftParams[] = Array(quantity).fill(mintNftParams)

        // Mint NFT
        const mintNftTransaction = await wallet
            .prepareMintNfts(allNftParams, getDefaultTransactionOptions())
            .then((prepared) => plainToInstance(PreparedTransaction, prepared).send())
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
