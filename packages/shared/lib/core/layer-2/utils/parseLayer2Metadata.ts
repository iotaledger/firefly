import { Layer2Metadata } from '../types'

export function parseLayer2Metadata(metadata: string): Layer2Metadata {
    const parsedData = JSON.parse(metadata)
    validate(parsedData)

    return { ...parsedData }
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

    if (data.gasFee) {
        try {
            parseInt(data.gasFee, 10)
        } catch (error) {
            throw new Error('Invalid gasFee')
        }
    }

    if (data.ethereumAddress && typeof data.ethereumAddress !== 'string') {
        throw new Error('Invalid ethereumAddress')
    }
}
