import { Converter } from '@iota/util.js'
import BigInteger from 'big-integer'

import {
    IPersistedAsset,
    NewNftTransactionDetails,
    NewTokenTransactionDetails,
    NewTransactionDetails,
    NewTransactionType,
    TokenStandard,
} from '@core/wallet'
import { SpecialStream } from '../classes'
import { Allowance } from '../enums'
import { specialNativeTokenAmountEncoding } from '../utils'

export function encodeAssetAllowance(transactionDetails: NewTransactionDetails): Uint8Array {
    const allowance = new SpecialStream()
    if (transactionDetails.type === NewTransactionType.TokenTransfer) {
        const asset = transactionDetails.asset
        if (asset?.standard === TokenStandard.BaseToken) {
            allowance.writeUInt8('encodedAllowance', Allowance.HasBaseTokens)
            encodeBaseTokenTransfer(allowance, transactionDetails.rawAmount)
        } else if (asset) {
            allowance.writeUInt8('encodedAllowance', Allowance.HasNativeTokens)
            encodeNativeTokenTransfer(allowance, asset, transactionDetails)
        }
    } else if (transactionDetails.type === NewTransactionType.NftTransfer) {
        allowance.writeUInt8('encodedAllowance', Allowance.hasNFTs)
        encodeNftTransfer(allowance, transactionDetails)
    }
    return allowance.finalBytes()
}

function encodeBaseTokenTransfer(buffer: SpecialStream, rawAmount: string): void {
    buffer.writeUInt64SpecialEncoding('baseTokenAmount', BigInteger(rawAmount))
}

function encodeNativeTokenTransfer(
    buffer: SpecialStream,
    asset: IPersistedAsset,
    transactionDetails: NewTokenTransactionDetails
): void {
    const { rawAmount } = transactionDetails
    buffer.writeUInt32SpecialEncoding('amountOfDifferentTokens', 1)
    const tokenIdBytes = Converter.hexToBytes(asset.id)
    buffer.writeBytes('tokenId', tokenIdBytes.length, tokenIdBytes)

    const encodedAmount = specialNativeTokenAmountEncoding(BigInt(rawAmount))
    buffer.writeUInt32SpecialEncoding('length', encodedAmount.length)
    buffer.writeBytes('nativeTokenAmount', encodedAmount.length, encodedAmount)
}

function encodeNftTransfer(buffer: SpecialStream, transactionDetails: NewNftTransactionDetails): void {
    buffer.writeUInt32SpecialEncoding('nftAmount', 1)
    const nftIdBytes = Converter.hexToBytes(transactionDetails.nftId)
    buffer.writeBytes('nftId', nftIdBytes.length, nftIdBytes)
}
