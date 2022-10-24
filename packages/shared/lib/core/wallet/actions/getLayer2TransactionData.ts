import { get } from 'svelte/store'
import BigInteger from 'big-integer'

import { WriteStream } from '@iota/util.js'
import { DestinationNetwork, NETWORK_ADDRESS } from '@core/network'
import { activeProfile } from '@core/profile'
import { newTransactionDetails, selectedAccountAssets, Subject } from '@core/wallet'
import { Converter } from '@lib/converter'

export function getLayer2TransactionData(
    network: DestinationNetwork,
    address: string
): { recipient: Subject; metadata: string } {
    const metadataStream = new WriteStream()
    const recipient = <Subject>{
        type: 'address',
        address: NETWORK_ADDRESS[get(activeProfile).networkType][network],
    }

    metadataStream.writeUInt32('senderContract', 0)
    metadataStream.writeUInt32('targetContract', 0x3c4b5e02)
    metadataStream.writeUInt32('contractFunction', 0x23f4e3a1)
    metadataStream.writeUInt64('gasBudget', BigInteger(500000000))

    const parameters = getSmartContractParameters(address)
    metadataStream.writeBytes('smartContractParameters', parameters.length, parameters)
    const allowance = getEncodedAllowance()
    metadataStream.writeBytes('allowance', allowance.length, allowance)

    metadataStream.writeUInt16('end', 0)
    const metadata = '0x' + metadataStream.finalHex()
    return { recipient, metadata }
}

function getSmartContractParameters(address: string): Uint8Array {
    const parameters = new WriteStream()

    const encodedAddress = getEncodedAddress(address.toLowerCase())
    const smartContractParameters = Object.entries({ a: encodedAddress, c: '255' })
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
    const { asset, surplus, rawAmount } = get(newTransactionDetails)
    allowance.writeUInt8('encodedAllowance', 0)
    if (asset === get(selectedAccountAssets).baseCoin) {
        allowance.writeUInt64('iotaAmount', BigInteger(rawAmount))
    } else {
        allowance.writeUInt64('iotaAmount', BigInteger(surplus ?? '0'))

        const tokenBuffer = new WriteStream()
        const tokenIdBytes = Converter.hexToBytes(asset.id)
        tokenBuffer.writeBytes('tokenId', tokenIdBytes.length, tokenIdBytes)
        tokenBuffer.writeUInt256('amount', BigInteger(rawAmount))
        const tokenBufferBytes = tokenBuffer.finalBytes()

        allowance.writeUInt16('tokensLength', tokenBufferBytes.length)
        allowance.writeBytes('tokenBuffer', tokenBufferBytes.length, tokenBufferBytes)
    }
    return allowance.finalBytes()
}
