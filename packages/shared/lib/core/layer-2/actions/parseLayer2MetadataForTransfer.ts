import { Converter } from '@core/utils'
import { ReadStream } from '@iota/util.js'
import type { ILayer2SmartContractMetadata } from '@core/layer-2/interfaces'

export function parseLayer2MetadataForTransfer(metadata: Uint8Array): unknown {
    const readStream = new ReadStream(metadata)

    const senderContract = readStream.readUInt32('senderContract')
    const targetContract = readStream.readUInt32('targetContract')
    const contractFunction = readStream.readUInt32('contractFunction')
    const gasBudget = readStream.readUInt64('gasBudget')

    const smartContractMetadata: ILayer2SmartContractMetadata = {
        senderContract: Converter.decimalToHex(senderContract, true),
        targetContract: Converter.decimalToHex(targetContract, true),
        contractFunction: Converter.decimalToHex(contractFunction, true),
        gasBudget,
    }

    console.error('Smart Contract Metadata', smartContractMetadata)
    const smartContractParametersAmount = readStream.readUInt32('parametersLength')
    const smartContractParameters: Record<string, unknown> = {}
    // How do we know what type of data is represented by the bytes?
    for (let index = 0; index < smartContractParametersAmount; index++) {
        const keyLength = readStream.readUInt16('keyLength')
        const keyBytes = readStream.readBytes('keyValue', keyLength)

        const valueLength = readStream.readUInt32('valueLength')
        const valueBytes = readStream.readBytes('valueBytes', valueLength)

        const key = Converter.bytesToUtf8(keyBytes)
        const value = Converter.bytesToHex(valueBytes)

        smartContractParameters[key] = value
    }

    const remainingBytes = readStream.unused()
    if (remainingBytes <= 2) {
        console.error('End reached')
        return
    } else {
        const allowance = readStream.readBytes('valueBytes', remainingBytes - 2)
        console.error('Allowance', Converter.bytesToHex(allowance))
    }
}
