import BigInteger from 'big-integer'
import { WriteStream, Converter } from '@iota/util.js'

import { EMPTY_BUFFER_BYTE_LENGTH, EMPTY_BUFFER } from '../constants'
import { Allowance } from '../enums'
import {
    NewTransactionType,
    TokenStandard,
    NewTokenTransactionDetails,
    IPersistedAsset,
    NewNftTransactionDetails,
    NewTransactionDetails,
} from '@core/wallet'

export function encodeAssetAllowance(transactionDetails: NewTransactionDetails): Uint8Array {
    const allowance = new WriteStream()
    allowance.writeUInt8('encodedAllowance', Allowance.Set)

    if (transactionDetails.type === NewTransactionType.TokenTransfer) {
        const asset = transactionDetails.asset
        if (asset.standard === TokenStandard.BaseToken) {
            encodeBaseTokenTransfer(allowance, transactionDetails.rawAmount)
        } else {
            encodeNativeTokenTransfer(allowance, asset, transactionDetails)
        }
        allowance.writeUInt16('noNfts', EMPTY_BUFFER)
    } else if (transactionDetails.type === NewTransactionType.NftTransfer) {
        encodeNftTransfer(allowance, transactionDetails)
    }

    return allowance.finalBytes()
}

function encodeBaseTokenTransfer(buffer: WriteStream, rawAmount: string): void {
    buffer.writeUInt64('iotaAmount', BigInteger(rawAmount))
    buffer.writeUInt16('noTokens', EMPTY_BUFFER_BYTE_LENGTH)
    buffer.writeUInt16('emptyTokenBuffer', EMPTY_BUFFER)
}

function encodeNativeTokenTransfer(
    buffer: WriteStream,
    asset: IPersistedAsset,
    transactionDetails: NewTokenTransactionDetails
): void {
    const { surplus, rawAmount } = transactionDetails
    const tokenBuffer = new WriteStream()

    tokenBuffer.writeUInt16('amountOfTokens', 1)
    const tokenIdBytes = Converter.hexToBytes(asset.id)
    tokenBuffer.writeBytes('tokenId', tokenIdBytes.length, tokenIdBytes)
    tokenBuffer.writeUInt256('amount', BigInteger(rawAmount))
    const tokenBufferBytes = tokenBuffer.finalBytes()

    buffer.writeUInt64('iotaAmount', BigInteger(surplus ?? '0'))
    buffer.writeUInt16('tokensLength', tokenBufferBytes.length)
    buffer.writeBytes('tokenBuffer', tokenBufferBytes.length, tokenBufferBytes)
}

function encodeNftTransfer(buffer: WriteStream, transactionDetails: NewNftTransactionDetails): void {
    encodeBaseTokenTransfer(buffer, '0')

    buffer.writeUInt16('NftAmount', 1)
    const nftIdBytes = Converter.hexToBytes(transactionDetails.nftId)
    buffer.writeBytes('NftId', nftIdBytes.length, nftIdBytes)
}
