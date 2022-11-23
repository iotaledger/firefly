import { Converter } from '@core/utils'
import { ReadStream } from '@iota/util.js'
import { Allowance, FORCE_OPEN_ACCOUNT, ILayer2SmartContractCallData, ITransferAllowanceMetadata } from '@core/layer-2'
import { NativeTokenAmount, TOKEN_ID_BYTE_LENGTH } from '@core/token'

export function parseLayer2MetadataForTransfer(metadata: Uint8Array): {
    smartContractData: ILayer2SmartContractCallData
    allowanceData: ITransferAllowanceMetadata
} {
    const readStream = new ReadStream(metadata)

    const senderContract = readStream.readUInt32('senderContract')
    const targetContract = readStream.readUInt32('targetContract')
    const contractFunction = readStream.readUInt32('contractFunction')
    const gasBudget = readStream.readUInt64('gasBudget')

    const smartContractData: ILayer2SmartContractCallData = {
        senderContract: Converter.decimalToHex(senderContract, true),
        targetContract: Converter.decimalToHex(targetContract, true),
        contractFunction: Converter.decimalToHex(contractFunction, true),
        gasBudget,
    }

    const smartContractParametersAmount = readStream.readUInt32('parametersLength')
    const smartContractParameters: Record<string, string> = {}
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
        const allowance = readStream.readUInt8('allowance')

        if (allowance === Allowance.Set) {
            const baseTokenAmount = readStream.readUInt64('baseTokenAmount').toString()
            const tokenBufferLength = readStream.readUInt16('tokenBufferBytes.length')
            const tokenAmount = Math.floor(tokenBufferLength / (TOKEN_ID_BYTE_LENGTH + 32))
            const nativeTokens: NativeTokenAmount[] = []

            for (let token = 0; token < tokenAmount; token++) {
                const tokenId = Converter.bytesToHex(readStream.readBytes('tokenId', TOKEN_ID_BYTE_LENGTH))
                const amount = readStream.readUInt256('tokenAmount').toString()
                nativeTokens.push({ tokenId, amount })
            }
            const allowanceData: ITransferAllowanceMetadata = {
                ethereumAddress: '0x' + smartContractParameters['a'].substring(2),
                forceOpenAccount: smartContractParameters['c'] === FORCE_OPEN_ACCOUNT,
                baseTokenAmount,
                nativeTokens,
            }
            return {
                smartContractData,
                allowanceData,
            }
        } else {
            return
        }
    }
}
