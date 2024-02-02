import { activeProfileId } from '@core/profile/stores/active-profile-id.store'
import {
    getBech32AddressFromAddressTypes,
    getIssuerFromNftOutput,
    getMetadataFromNftOutput,
    getNftId,
} from '@core/wallet/utils'
import { IWrappedOutput } from '@core/wallet/interfaces'
import { get } from 'svelte/store'
import { DEFAULT_NFT_NAME } from '../constants'
import { INft } from '../interfaces'
import { parseNftMetadata } from './parseNftMetadata'
import { composeUrlFromNftUri } from './composeUrlFromNftUri'
import { getSpendableStatusFromUnspentNftOutput } from './getSpendableStatusFromUnspentNftOutput'
import { Address, AddressType, NftOutput } from '@iota/sdk/out/types'

export function buildNftFromNftOutput(
    wrappedOutput: IWrappedOutput,
    accountAddress: string,
    calculateStatus: boolean = true
): INft {
    const nftOutput = wrappedOutput.output as NftOutput

    let isSpendable = false
    let timeLockTime: number | undefined = undefined

    if (calculateStatus) {
        const status = getSpendableStatusFromUnspentNftOutput(accountAddress, nftOutput)
        isSpendable = status.isSpendable
        timeLockTime = status.timeLockTime
    }

    const id = getNftId(nftOutput.nftId, wrappedOutput.outputId)
    const address = getBech32AddressFromAddressTypes({ type: AddressType.Nft, nftId: id } as unknown as Address)
    const issuer = getIssuerFromNftOutput(nftOutput)
    const metadata = getMetadataFromNftOutput(nftOutput)
    const parsedMetadata = parseNftMetadata(metadata)
    const composedUrl = composeUrlFromNftUri(parsedMetadata?.uri)
    const filePath = `${get(activeProfileId)}/nfts/${id}`
    const storageDeposit = Number(nftOutput.amount)
    const mana = Number(nftOutput.mana)

    return {
        id,
        address,
        name: parsedMetadata?.name ?? DEFAULT_NFT_NAME,
        issuer,
        isSpendable,
        timelockTime: timeLockTime ? Number(timeLockTime) : undefined,
        metadata,
        parsedMetadata,
        latestOutputId: wrappedOutput.outputId,
        composedUrl,
        downloadUrl: composedUrl,
        filePath,
        storageDeposit,
        downloadMetadata: {
            error: undefined,
            warning: undefined,
            isLoaded: false,
        },
        mana,
    }
}
