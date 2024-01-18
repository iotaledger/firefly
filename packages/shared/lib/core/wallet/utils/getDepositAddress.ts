import { AccountOutput, BlockIssuerFeature, FeatureType } from '@iota/sdk'
import type { Ed25519BlockIssuerKey } from '@iota/sdk/out/types/block/output/block-issuer-key'
import { selectedWallet } from '../stores'
import { get } from 'svelte/store'

// TODO(2.0): Update the implementation to handle multiple accounts and use the selected account's address.
export async function getDepositAddress(): Promise<string> {
    const wallet = get(selectedWallet)
    const accounts = await wallet?.accounts()
    if (accounts?.length) {
        const depositAddress =
            (
                (
                    (accounts[0]?.output as AccountOutput).features?.find(
                        (feat) => feat?.type === FeatureType.BlockIssuer
                    ) as BlockIssuerFeature
                )?.blockIssuerKeys[0] as Ed25519BlockIssuerKey
            )?.publicKey ?? ''
        return depositAddress
    } else {
        return ''
    }
}
