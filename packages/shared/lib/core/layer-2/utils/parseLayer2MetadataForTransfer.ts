import { Converter } from '@core/utils'
import { ReadStream } from '@iota/util.js'
import { NativeTokenAmount, TOKEN_ID_BYTE_LENGTH } from '@core/token'
import { ILayer2Allowance, ILayer2TransferAllowanceMetadata } from '../interfaces'
import { CONTRACT_FUNCTIONS, TARGET_CONTRACTS } from '../constants'
import { Allowance } from '../enums'

export function parseLayer2MetadataForTransfer(metadata: Uint8Array): ILayer2TransferAllowanceMetadata {
    const readStream = new ReadStream(metadata)

    const senderContract = readStream.readUInt32('senderContract')
    const targetContract = readStream.readUInt32('targetContract')
    const contractFunction = readStream.readUInt32('contractFunction')
    const gasBudget = readStream.readUInt64('gasBudget')

    const smartContractParameters = parseSmartContractParameters(readStream)
    const ethereumAddress = '0x' + smartContractParameters['a'].substring(2)

    const allowance = parseAllowance(readStream)

    return {
        senderContract: Converter.decimalToHex(senderContract),
        targetContract: TARGET_CONTRACTS[targetContract] ?? Converter.decimalToHex(targetContract),
        contractFunction: CONTRACT_FUNCTIONS[contractFunction] ?? Converter.decimalToHex(contractFunction),
        gasBudget: gasBudget.toString(),
        ethereumAddress,
        baseTokenAmount: allowance?.baseTokenAmount,
        nativeTokens: allowance?.nativeTokens,
    }
}

function parseSmartContractParameters(readStream: ReadStream): Record<string, string> {
    const smartContractParametersAmount = readStream.readUInt32('parametersLength')
    const smartContractParameters: Record<string, string> = {}

    for (let index = 0; index < smartContractParametersAmount; index++) {
        const keyLength = readStream.readUInt16('keyLength')
        const keyBytes = readStream.readBytes('keyValue', keyLength)

        const valueLength = readStream.readUInt32('valueLength')
        const valueBytes = readStream.readBytes('valueBytes', valueLength)

        const key = Converter.bytesToUtf8(keyBytes)
        const value = Converter.bytesToHex(valueBytes)

        smartContractParameters[key] = value
    }

    return smartContractParameters
}

function parseAllowance(readStream: ReadStream): ILayer2Allowance {
    const allowance = readStream.readUInt8('allowance')

    if (allowance === Allowance.Set) {
        const baseTokenAmount = readStream.readUInt64('baseTokenAmount').toString()
        readStream.readUInt16('tokenBufferBytesLength')
        const tokenAmount = readStream.readUInt16('tokenAmount')
        const nativeTokens: NativeTokenAmount[] = []

        for (let token = 0; token < tokenAmount; token++) {
            const tokenId = Converter.bytesToHex(readStream.readBytes('tokenId', TOKEN_ID_BYTE_LENGTH))
            const amount = readStream.readUInt256('tokenAmount').toString()
            nativeTokens.push({ tokenId, amount })
        }

        return {
            baseTokenAmount,
            nativeTokens,
        }
    } else {
        return
    }
}
