import { get } from 'svelte/store'
import BigInteger from 'big-integer'

import { WriteStream } from '@iota/util.js'
import { newTransactionDetails, NewTransactionType, selectedAccountAssets } from '@core/wallet'
import { Converter } from '@core/utils'
import {
    ACCOUNTS_CONTRACT,
    EMPTY_BUFFER,
    EMPTY_BUFFER_BYTE_LENGTH,
    ENDING_SIGNAL_BYTE,
    EXTERNALLY_OWNED_ACCOUNT,
    EXTERNALLY_OWNED_ACCOUNT_TYPE_ID,
    FORCE_OPEN_ACCOUNT,
    GAS_BUDGET,
    SET_ALLOWANCE,
    TRANSFER_ALLOWANCE,
} from '@core/layer-2/constants'

export function getLayer2MetadataForTransfer(layer2Address: string): string {
    const metadataStream = new WriteStream()

    metadataStream.writeUInt32('senderContract', EXTERNALLY_OWNED_ACCOUNT)
    metadataStream.writeUInt32('targetContract', ACCOUNTS_CONTRACT)
    metadataStream.writeUInt32('contractFunction', TRANSFER_ALLOWANCE)
    metadataStream.writeUInt64('gasBudget', GAS_BUDGET)

    const parameters = getSmartContractParameters(layer2Address)
    metadataStream.writeBytes('smartContractParameters', parameters.length, parameters)
    const allowance = getEncodedAllowance()
    metadataStream.writeBytes('allowance', allowance.length, allowance)

    metadataStream.writeUInt16('end', ENDING_SIGNAL_BYTE)
    const metadata = '0x' + metadataStream.finalHex()
    return metadata
}

function getSmartContractParameters(address: string): Uint8Array {
    const parameters = new WriteStream()

    const encodedAddress = getEncodedAddress(address.toLowerCase())
    const smartContractParameters = Object.entries({ a: encodedAddress, c: FORCE_OPEN_ACCOUNT })
    parameters.writeUInt32('parametersLength', smartContractParameters.length)

    for (const parameter of smartContractParameters) {
        const [key, value] = parameter

        const keyBytes = Converter.utf8ToBytes(key)
        parameters.writeUInt16('keyLength', key.length)
        parameters.writeBytes('keyBytes', keyBytes.length, keyBytes)

        const valueBytes = Converter.hexToBytes(value)
        parameters.writeUInt32('valueLength', valueBytes.length)
        parameters.writeBytes('valueBytes', valueBytes.length, valueBytes)
    }
    return parameters.finalBytes()
}

function getEncodedAddress(address: string): string {
    const encodedAddress = new WriteStream()
    encodedAddress.writeUInt8('Address Type ID', EXTERNALLY_OWNED_ACCOUNT_TYPE_ID)
    const [, ...addressBytes] = Converter.hexToBytes(address)
    for (const byte of addressBytes) {
        encodedAddress.writeUInt8('Address byte', byte)
    }
    return encodedAddress.finalHex()
}

function getEncodedAllowance(): Uint8Array {
    const allowance = new WriteStream()
    const tokenBuffer = new WriteStream()

    const transactionDetails = get(newTransactionDetails)
    if (transactionDetails.type === NewTransactionType.TokenTransfer) {
        allowance.writeUInt8('encodedAllowance', SET_ALLOWANCE)

        const { asset, surplus, rawAmount } = transactionDetails
        if (asset === get(selectedAccountAssets).baseCoin) {
            allowance.writeUInt64('iotaAmount', BigInteger(rawAmount))
            allowance.writeUInt16('noTokens', EMPTY_BUFFER_BYTE_LENGTH)
            allowance.writeUInt16('emptyTokenBuffer', EMPTY_BUFFER)
        } else {
            allowance.writeUInt64('iotaAmount', BigInteger(surplus ?? '0'))
            const tokenIdBytes = Converter.hexToBytes(asset.id)
            tokenBuffer.writeBytes('tokenId', tokenIdBytes.length, tokenIdBytes)
            tokenBuffer.writeUInt256('amount', BigInteger(rawAmount))
            const tokenBufferBytes = tokenBuffer.finalBytes()
            allowance.writeUInt16('tokensLength', tokenBufferBytes.length)
            allowance.writeBytes('tokenBuffer', tokenBufferBytes.length, tokenBufferBytes)
        }
    }
    return allowance.finalBytes()
}
