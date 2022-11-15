import { getIssuerFromNftOutput, getMetadataFromNftOutput, getNftId } from '@core/wallet'
import { INftOutput } from '@iota/types'
import { DEFAULT_NFT_NAME } from '../constants'
import { INft } from '../interfaces'
import { parseNftMetadata } from './parseNftMetadata'

export function buildNftFromNftOutput(nftOutput: INftOutput, outputId: string, isOwned: boolean): INft {
    const id = getNftId(nftOutput.nftId, outputId)
    const issuer = getIssuerFromNftOutput(nftOutput)
    const metadata = getMetadataFromNftOutput(nftOutput)
    const parsedMetadata = parseNftMetadata(metadata)
    const requiredStorageDeposit = Number(nftOutput.amount)
    return {
        id,
        name: parsedMetadata?.name ?? DEFAULT_NFT_NAME,
        issuer,
        isOwned,
        metadata,
        parsedMetadata: parsedMetadata,
        requiredStorageDeposit,
    }
}
