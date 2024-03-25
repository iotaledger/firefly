import { IIrc27Metadata } from '@core/nfts'
import { Converter } from '@core/utils'
import { MetadataFeature, MintNftParams, PreparedTransaction } from '@iota/sdk/out/types'
import { getSelectedWallet } from '../stores'
import { getDefaultTransactionOptions } from '../utils'
import { DEFAULT_METADATA_FEATURE_ENTRY_KEY } from '../constants'

export async function prepareMintNft(
    metadata: IIrc27Metadata,
    quantity: number
): Promise<PreparedTransaction | undefined> {
    try {
        const wallet = getSelectedWallet()
        if (!wallet) return
        const mintNftParams: MintNftParams = {
            issuer: wallet.depositAddress,
            address: wallet.depositAddress,
            immutableMetadata: new MetadataFeature({
                [DEFAULT_METADATA_FEATURE_ENTRY_KEY]: Converter.utf8ToHex(JSON.stringify(metadata)),
            }),
        }

        const allNftParams: MintNftParams[] = Array(quantity).fill(mintNftParams)

        // Prepare Mint NFT
        return wallet.prepareMintNfts(allNftParams, getDefaultTransactionOptions())
    } catch (err) {
        return Promise.reject(err)
    }
}
