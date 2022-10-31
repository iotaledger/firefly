import { IAccountState } from '@core/account'
import { activeAccounts } from '@core/profile'
import { INftOutput } from '@iota/types'
import { get } from 'svelte/store'
import { OUTPUT_TYPE_NFT, UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN } from '../constants'
import { INft } from '../interfaces'
import { setAccountNftsInAllAccountNfts } from '../stores'
import {
    getExpirationUnixTimeFromOutput,
    getIssuerFromNftOutput,
    getMetadataFromNftOutput,
    getNftId,
    getRecipientAddressFromOutput,
    isOutputAsync,
    parseNftMetadata,
} from '../utils'

export async function loadNftsForActiveProfile(): Promise<void> {
    const allAccounts = get(activeAccounts)
    for (const account of allAccounts) {
        await loadNftsForAccount(account)
    }
}

export async function loadNftsForAccount(account: IAccountState): Promise<void> {
    const accountNfts: INft[] = []
    const unspentOutputs = await account.unspentOutputs()
    for (const outputData of unspentOutputs) {
        if (outputData.output.type === OUTPUT_TYPE_NFT) {
            const isOwned = getIsOwnedFromUnspentNftOutput(account.depositAddress, outputData.output)
            const nft = buildNftFromNftOutput(outputData.output, outputData.outputId, isOwned)
            accountNfts.push(nft)
        }
    }
    setAccountNftsInAllAccountNfts(account.index, accountNfts)
}

export function getIsOwnedFromUnspentNftOutput(accountAddress: string, nftOutput: INftOutput): boolean {
    const isAsync = isOutputAsync(nftOutput)
    if (isAsync) {
        const expirationUnixTime = getExpirationUnixTimeFromOutput(nftOutput)
        const isRecipient = getRecipientAddressFromOutput(nftOutput) === accountAddress
        const hasStorageDepositReturnUnlockCondition = nftOutput.unlockConditions.some(
            (unlockCondition) => unlockCondition?.type === UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN
        )
        if (expirationUnixTime) {
            if (isRecipient) {
                return false
            } else {
                return expirationUnixTime < Date.now()
            }
        } else if (hasStorageDepositReturnUnlockCondition) {
            return false
        }
    } else {
        return true
    }
}

export function buildNftFromNftOutput(nftOutput: INftOutput, outputId: string, isOwned: boolean): INft {
    const id = getNftId(nftOutput.nftId, outputId)
    const issuer = getIssuerFromNftOutput(nftOutput)
    const metadata = getMetadataFromNftOutput(nftOutput)
    const parsedMetadata = parseNftMetadata(metadata)
    return {
        id,
        name: parsedMetadata?.name ?? DEFAULT_NFT_NAME,
        issuer,
        isOwned,
        metadata,
        parsedMetadata: parsedMetadata,
    }
}

export const DEFAULT_NFT_NAME = 'NFT'
