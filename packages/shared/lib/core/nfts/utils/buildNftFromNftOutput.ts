import { getIssuerFromNftOutput, getMetadataFromNftOutput, getNftId } from '@core/wallet'
import { INftOutput } from '@iota/types'
import { DEFAULT_NFT_NAME } from '../constants'
import { INft } from '../interfaces'
import { parseNftMetadata } from './parseNftMetadata'

export function buildNftFromNftOutput(nftOutput: INftOutput, outputId: string, isSpendable: boolean): INft {
    const id = getNftId(nftOutput.nftId, outputId)
    const issuer = getIssuerFromNftOutput(nftOutput)
    const metadata = getMetadataFromNftOutput(nftOutput)
    const parsedMetadata = parseNftMetadata(metadata)
    return {
        id,
        name: parsedMetadata?.name ?? DEFAULT_NFT_NAME,
        issuer,
        isSpendable,
        metadata,
        parsedMetadata: parsedMetadata,
        latestOutputId: outputId,
    }
}
