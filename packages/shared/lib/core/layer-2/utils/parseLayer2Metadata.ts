import { ILayer2TransferAllowanceMetadata } from '../interfaces'

type Layer2Metadata = Omit<ILayer2TransferAllowanceMetadata, 'baseTokenAmount' | 'nativeTokens'>

export function parseLayer2Metadata(metadata: string): Layer2Metadata {
    const parsedData = JSON.parse(metadata)
    validate(parsedData)

    return {
        senderContract: parsedData.senderContract,
        targetContract: parsedData.targetContract,
        contractFunction: parsedData.contractFunction,
        gasBudget: parsedData.gasBudget,
        ethereumAddress: parsedData.ethereumAddress,
        forceOpenAccount: parsedData.forceOpenAccount,
    }
}

function validate(data: Layer2Metadata): void {
    if (!data) {
        throw new Error('Invalid Metadata')
    }

    if (data.senderContract && typeof data.senderContract !== 'string') {
        throw new Error('Invalid senderContract')
    }

    if (data.targetContract && typeof data.targetContract !== 'string') {
        throw new Error('Invalid targetContract')
    }

    if (data.contractFunction && typeof data.contractFunction !== 'string') {
        throw new Error('Invalid contractFunction')
    }

    if (data.gasBudget) {
        try {
            parseInt(data.gasBudget, 10)
        } catch (error) {
            throw new Error('Invalid gasBudget')
        }
    }

    if (data.ethereumAddress && typeof data.ethereumAddress !== 'string') {
        throw new Error('Invalid ethereumAddress')
    }

    if (data.forceOpenAccount && typeof data.forceOpenAccount !== 'boolean') {
        throw new Error('Invalid forceOpenAccount')
    }
}
