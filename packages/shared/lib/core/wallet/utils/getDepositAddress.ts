import { AccountOutput, BlockIssuerFeature, FeatureType } from '@iota/sdk'
import type { Ed25519BlockIssuerKey } from '@iota/sdk/out/types/block/output/block-issuer-key'
import { selectedWallet } from '../stores'
import { get } from 'svelte/store'

// TODO(2.0): the implementation is incorrect, the deposit address should be the address of the selected block issuer account output , not the ed25519 address
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
