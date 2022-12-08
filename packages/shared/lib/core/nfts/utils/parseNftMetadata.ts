import { networkHrp } from '@core/network/stores'
import { Converter } from '@core/utils/convert'
import { validateBech32Address } from '@core/utils/crypto'
import { isValidUri } from '@core/utils/validation'
import { Irc27Version, TokenStandard } from '@core/wallet/enums'
import { get } from 'svelte/store'
import { IIrc27Attribute, IIrc27Metadata } from '../interfaces'
import { MimeType } from '../types'

export function parseNftMetadata(metadata: string): IIrc27Metadata {
    try {
        const convertedData = Converter.hexToUtf8(metadata)
        const parsedData = metadata ? JSON.parse(convertedData) : {}
        validateRequiredFieldsForIrc27(parsedData)
        const parsedMetadata: IIrc27Metadata = {
            standard: parsedData.standard,
            version: parsedData.version,
            type: parsedData.type as MimeType,
            uri: parsedData.uri,
            name: parsedData.name,
            description: parsedData?.description,
            issuerName: parsedData?.issuerName,
            collectionName: parsedData?.collectionName,
            attributes: getValidAttributes(parsedData?.attributes),
            royalties: getValidRoyalties(parsedData?.royalties),
        }
        return parsedMetadata
    } catch (error) {
        return undefined
    }
}

function validateRequiredFieldsForIrc27(data: IIrc27Metadata): void {
    if (!data?.standard || data?.standard !== TokenStandard.Irc27) {
        throw 'Invalid standard, must be "IRC27"'
    }

    if (!data?.version || data?.version !== Irc27Version.V1) {
        throw 'Invalid version of IRC27, must be "v1.0"'
    }

    if (!data?.type) {
        throw 'Type is a required field'
    }

    if (data?.uri.length === 0) {
        throw 'Empty URI'
    } else if (!isValidUri(data.uri)) {
        throw 'Invalid URI'
    }

    if (data?.name.length === 0) {
        throw 'Name is a required field'
    }
}

function getValidAttributes(attributes: unknown): IIrc27Attribute[] {
    if (!Array.isArray(attributes)) {
        return undefined
    }
    const isArrayOfObjects = attributes.every(
        (attribute) => typeof attribute === 'object' && !Array.isArray(attribute) && attribute !== null
    )
    if (!isArrayOfObjects) {
        return undefined
    }
    const isKeysValid = attributes.every(
        (attribute) =>
            Object.keys(attribute).every((key) => key === 'trait_type' || key === 'value') &&
            Object.keys(attribute).filter((key) => key === 'trait_type').length === 1 &&
            Object.keys(attribute).filter((key) => key === 'value').length === 1
    )
    if (!isKeysValid) {
        return undefined
    }
    const isValuesValid = attributes.every(
        (attribute) =>
            (typeof attribute.trait_type === 'string' &&
                attribute.trait_type.length > 0 &&
                typeof attribute.value === 'string' &&
                attribute.value.length > 0) ||
            typeof attribute.value === 'number'
    )
    if (!isValuesValid) {
        return undefined
    }

    return attributes as IIrc27Attribute[]
}

function getValidRoyalties(royalties: unknown): Record<string, number> {
    try {
        Object.keys(royalties).forEach((key) => validateBech32Address(get(networkHrp), key))
    } catch (err) {
        return undefined
    }

    const isValuesValid = Object.values(royalties).every((value) => value >= 0 && value <= 1)
    if (!isValuesValid) {
        return undefined
    }

    const isSumValid = Object.values(royalties).reduce((acc, val) => acc + val, 0) <= 1
    if (!isSumValid) {
        return undefined
    }

    return royalties as Record<string, number>
}
