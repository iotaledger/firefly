import { DEFAULT_NFT_FEATURE_ENTRY_KEY, IIrc27Metadata } from '@core/nfts'
import { Converter } from '@core/utils'
import { Bech32Address, MetadataFeature, MintNftParams, PreparedTransaction } from '@iota/sdk/out/types'
import { getSelectedWallet } from '../stores'
import { getDefaultTransactionOptions } from '../utils'

// TODO: Update this temporary interface when fixed in the SDK, linked issue https://github.com/iotaledger/firefly/issues/8134
interface MintNftParamsTemp {
    issuer: Bech32Address
    address: Bech32Address
    immutableMetadata: MetadataFeature
}

export async function prepareMintNft(
    metadata: IIrc27Metadata,
    quantity: number
): Promise<PreparedTransaction | undefined> {
    try {
        const wallet = getSelectedWallet()
        if (!wallet) return
        const mintNftParams: MintNftParamsTemp = {
            issuer: wallet.depositAddress,
            address: wallet.depositAddress,
            immutableMetadata: new MetadataFeature({
                [DEFAULT_NFT_FEATURE_ENTRY_KEY]: Converter.utf8ToHex(JSON.stringify(metadata)),
            }),
        }

        const allNftParams: MintNftParams[] = Array(quantity).fill(mintNftParams)

        // Prepare Mint NFT
        return wallet.prepareMintNfts(allNftParams, getDefaultTransactionOptions())
    } catch (err) {
        return Promise.reject(err)
    }
}
