import BigInteger from 'big-integer'

import { WriteStream } from '@iota/util.js'
import { getPersistedAsset, NewTransactionType } from '@core/wallet/stores'
import { getAddressFromSubject } from '@core/wallet/utils'
import { TokenStandard } from '@core/wallet/enums'
import type { NewTransactionDetails } from '@core/wallet/types'
import { Converter } from '@core/utils'
import {
    ACCOUNTS_CONTRACT,
    Allowance,
    EMPTY_BUFFER,
    EMPTY_BUFFER_BYTE_LENGTH,
    ENDING_SIGNAL_BYTE,
    EXTERNALLY_OWNED_ACCOUNT,
    EXTERNALLY_OWNED_ACCOUNT_TYPE_ID,
    GAS_BUDGET,
    TRANSFER_ALLOWANCE,
} from '@core/layer-2'

export function getLayer2MetadataForTransfer(transactionDetails: NewTransactionDetails): string {
    const metadataStream = new WriteStream()

    metadataStream.writeUInt32('senderContract', EXTERNALLY_OWNED_ACCOUNT)
    metadataStream.writeUInt32('targetContract', ACCOUNTS_CONTRACT)
    metadataStream.writeUInt32('contractFunction', TRANSFER_ALLOWANCE)
    metadataStream.writeUInt64('gasBudget', GAS_BUDGET)

    const address = getAddressFromSubject(transactionDetails.recipient)
    const encodedAddress = encodeAddress(address.toLowerCase())

    const smartContractParameters = Object.entries({ a: encodedAddress })
    const parameters = encodeSmartContractParameters(smartContractParameters)
    metadataStream.writeBytes('smartContractParameters', parameters.length, parameters)

    const allowance = encodeAllowance(transactionDetails)
    metadataStream.writeBytes('allowance', allowance.length, allowance)

    metadataStream.writeUInt16('end', ENDING_SIGNAL_BYTE)
    const metadata = '0x' + metadataStream.finalHex()
    return metadata
}

function encodeSmartContractParameters(parameters: [string, string][]): Uint8Array {
    const encodedParameters = new WriteStream()
    encodedParameters.writeUInt32('parametersLength', parameters.length)

    for (const parameter of parameters) {
        const [key, value] = parameter

        const keyBytes = Converter.utf8ToBytes(key)
        encodedParameters.writeUInt16('keyLength', key.length)
        encodedParameters.writeBytes('keyBytes', keyBytes.length, keyBytes)

        const valueBytes = Converter.hexToBytes(value)
        encodedParameters.writeUInt32('valueLength', valueBytes.length)
        encodedParameters.writeBytes('valueBytes', valueBytes.length, valueBytes)
    }
    return encodedParameters.finalBytes()
}

function encodeAddress(address: string): string {
    const encodedAddress = new WriteStream()
    encodedAddress.writeUInt8('Address Type ID', EXTERNALLY_OWNED_ACCOUNT_TYPE_ID)
    const [, ...addressBytes] = Converter.hexToBytes(address)
    for (const byte of addressBytes) {
        encodedAddress.writeUInt8('Address byte', byte)
    }
    return encodedAddress.finalHex()
}

function encodeAllowance(transactionDetails: NewTransactionDetails): Uint8Array {
    const allowance = new WriteStream()
    const tokenBuffer = new WriteStream()

    if (transactionDetails.type === NewTransactionType.TokenTransfer) {
        allowance.writeUInt8('encodedAllowance', Allowance.Set)

        const { assetId, surplus, rawAmount } = transactionDetails
        const asset = getPersistedAsset(assetId)

        if (asset.standard === TokenStandard.BaseCoin) {
            allowance.writeUInt64('iotaAmount', BigInteger(rawAmount))
            allowance.writeUInt16('noTokens', EMPTY_BUFFER_BYTE_LENGTH)
            allowance.writeUInt16('emptyTokenBuffer', EMPTY_BUFFER)
        } else {
            allowance.writeUInt64('iotaAmount', BigInteger(surplus ?? '0'))

            tokenBuffer.writeUInt16('amountOfTokens', 1)
            const tokenIdBytes = Converter.hexToBytes(asset.id.substring(2))
            tokenBuffer.writeBytes('tokenId', tokenIdBytes.length, tokenIdBytes)
            tokenBuffer.writeUInt256('amount', BigInteger(rawAmount))
            const tokenBufferBytes = tokenBuffer.finalBytes()

            allowance.writeUInt16('tokensLength', tokenBufferBytes.length)
            allowance.writeBytes('tokenBuffer', tokenBufferBytes.length, tokenBufferBytes)
        }
    }
    return allowance.finalBytes()
}
