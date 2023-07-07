import { Converter } from '@core/utils'
import { ReadStream } from '@iota/util.js'
import { NativeTokenAmount, TOKEN_ID_BYTE_LENGTH } from '@core/token'
import { NFT_ID_BYTE_LENGTH } from '@core/nfts/constants'
import { ILayer2AssetAllowance, ILayer2TransferAllowanceMetadata } from '../interfaces'
import { CONTRACT_FUNCTIONS, TARGET_CONTRACTS } from '../constants'

export function parseLayer2MetadataForTransfer(metadata: Uint8Array): ILayer2TransferAllowanceMetadata {
    const readStream = new ReadStream(metadata)

    const senderContract = readStream.readUInt32('senderContract')
    const targetContract = readStream.readUInt32('targetContract')
    const contractFunction = readStream.readUInt32('contractFunction')
    const gasBudget = readStream.readUInt64('gasBudget')

    const smartContractParameters = parseSmartContractParameters(readStream)
    const ethereumAddress = '0x' + smartContractParameters['a'].substring(4)

    const allowance = parseAssetAllowance(readStream)

    return {
        senderContract: Converter.decimalToHex(senderContract),
        targetContract: TARGET_CONTRACTS[targetContract] ?? Converter.decimalToHex(targetContract),
        contractFunction: CONTRACT_FUNCTIONS[contractFunction] ?? Converter.decimalToHex(contractFunction),
        gasBudget: gasBudget.toString(),
        ethereumAddress,
        baseTokens: allowance?.baseTokens,
        nativeTokens: allowance?.nativeTokens,
        nfts: allowance?.nfts,
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

function parseAssetAllowance(readStream: ReadStream): ILayer2AssetAllowance {
    const allowance = readStream.readUInt8('allowance')

    if (allowance) {
        const baseTokens = readStream.readUInt64('baseTokens').toString()
        readStream.readUInt16('tokenBufferBytesLength')
        const tokenAmount = readStream.readUInt16('tokenAmount')
        const nativeTokens: NativeTokenAmount[] = []

        for (let token = 0; token < tokenAmount; token++) {
            const tokenId = Converter.bytesToHex(readStream.readBytes('tokenId', TOKEN_ID_BYTE_LENGTH))
            const amount = readStream.readUInt256('tokenAmount').toString()
            nativeTokens.push({ ID: [tokenId], amount })
        }

        const nftAmount = readStream.readUInt16('nftAmount')
        const nfts: string[] = []
        for (let nft = 0; nft < nftAmount; nft++) {
            const nftId = Converter.bytesToHex(readStream.readBytes('nftId', NFT_ID_BYTE_LENGTH))
            nfts.push(nftId)
        }

        return {
            baseTokens,
            nativeTokens,
            nfts,
        }
    } else {
        throw new Error('Smart contract call data does not set the asset allowance!')
    }
}
