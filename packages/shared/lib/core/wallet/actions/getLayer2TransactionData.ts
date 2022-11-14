import { get } from 'svelte/store'
import BigInteger from 'big-integer'

import { WriteStream } from '@iota/util.js'
import { newTransactionDetails, NewTransactionType, selectedAccountAssets } from '@core/wallet'
import { Converter } from '@core/utils'

export function getLayer2Metadata(layer2Address: string): string {
    const metadataStream = new WriteStream()

    metadataStream.writeUInt32('senderContract', 0)
    metadataStream.writeUInt32('targetContract', 0x3c4b5e02)
    metadataStream.writeUInt32('contractFunction', 0x23f4e3a1)
    metadataStream.writeUInt64('gasBudget', BigInteger(500000))

    const parameters = getSmartContractParameters(layer2Address)
    metadataStream.writeBytes('smartContractParameters', parameters.length, parameters)
    const allowance = getEncodedAllowance()
    metadataStream.writeBytes('allowance', allowance.length, allowance)

    metadataStream.writeUInt16('end', 0)
    const metadata = '0x' + metadataStream.finalHex()
    return metadata
}

function getSmartContractParameters(address: string): Uint8Array {
    const parameters = new WriteStream()

    const encodedAddress = getEncodedAddress(address.toLowerCase())
    const smartContractParameters = Object.entries({ a: encodedAddress, c: 'ff' })
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
    encodedAddress.writeUInt8('Address Type ID', 3)
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
        allowance.writeUInt8('encodedAllowance', 0)

        const { asset, surplus, rawAmount } = transactionDetails
        if (asset === get(selectedAccountAssets).baseCoin) {
            allowance.writeUInt64('iotaAmount', BigInteger(rawAmount))
            allowance.writeUInt16('noTokens', 2)
            allowance.writeUInt16('emptyTokenBuffer', 0)
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
