import { ILayer2TransferAllowanceMetadata } from '../interfaces'

type Layer2Metadata = Omit<ILayer2TransferAllowanceMetadata, 'baseTokenAmount' | 'nativeTokens'>

export function parseLayer2Metadata(metadata: string): Layer2Metadata {
    try {
        const parsedData = metadata ? JSON.parse(metadata) : {}
        validate(parsedData)
        const parsedMetadata: Layer2Metadata = {
            senderContract: parsedData.senderContract,
            targetContract: parsedData.targetContract,
            contractFunction: parsedData.contractFunction,
            gasBudget: parsedData.gasBudget,
            ethereumAddress: parsedData.ethereumAddress,
            forceOpenAccount: parsedData.forceOpenAccount,
        }
        return parsedMetadata
    } catch (error) {
        return undefined
    }
}

function validate(data: Layer2Metadata): void {
    if (data.senderContract && typeof data.senderContract !== 'string') {
        throw 'Invalid senderContract'
    }

    if (data.targetContract && typeof data.targetContract !== 'string') {
        throw 'Invalid targetContract'
    }

    if (data.contractFunction && typeof data.contractFunction !== 'string') {
        throw 'Invalid contractFunction'
    }

    if (data.gasBudget) {
        try {
            parseInt(data.gasBudget, 10)
        } catch (error) {
            throw 'Invalid gasBudget'
        }
    }

    if (data.ethereumAddress && typeof data.ethereumAddress !== 'string') {
        throw 'Invalid ethereumAddress'
    }

    if (data.forceOpenAccount && typeof data.forceOpenAccount !== 'boolean') {
        throw 'Invalid forceOpenAccount'
    }
}
