import { get } from 'svelte/store'

import { networkHrp } from '@core/network/stores'
import { isValidUri } from '@core/utils/validation'
import { validateBech32Address } from '@core/utils/crypto'
import { Converter } from '@core/utils/convert'
import { TokenStandard } from '@core/wallet/enums'

import { SupportedMimeType } from '../enums'
import { IIrc27Metadata } from '../interfaces'
import { MimeType } from '../types'

export function parseNftMetadata(metadata: string): IIrc27Metadata {
    try {
        const convertedData = Converter.hexToUtf8(metadata)
        const parsedData = metadata ? JSON.parse(convertedData) : {}
        validate(parsedData)
        const parsedMetadata: IIrc27Metadata = {
            standard: parsedData.standard,
            version: parsedData.version,
            type: parsedData.type as MimeType,
            uri: parsedData.uri,
            name: parsedData.name,
            collectionName: parsedData.collectionName,
            royalties: parsedData.royalties,
            issuerName: parsedData.issuerName,
            description: parsedData.description,
            attributes: parsedData.attributes,
        }
        return parsedMetadata
    } catch (error) {
        return undefined
    }
}

function validate(data: IIrc27Metadata): void {
    if (!data.standard || data.standard !== TokenStandard.IRC27) {
        throw 'Invalid standard, must be "IRC27"'
    }

    if (!Object.keys(SupportedMimeType).includes(data.type)) {
        throw 'Invalid MimeType, check if the file type is supported'
    }

    if (data.name.length === 0) {
        throw 'Empty name, it is a required field'
    }

    if (data.uri.length === 0) {
        throw 'Empty URI'
    } else if (!isValidUri(data.uri)) {
        throw 'Invalid URI'
    }

    if (data.royalties) {
        validateRoyalties(data.royalties)
    }

    if (data.attributes) {
        validateAttributes(data.attributes)
    }
}

function validateRoyalties(royalties: unknown): void {
    const isKeysValid = Object.keys(royalties).every((key) => validateBech32Address(get(networkHrp), key))
    if (!isKeysValid) {
        throw `Invalid royalty address, must be a valid ${get(networkHrp)} address where royalties will be sent to.`
    }

    const isValuesValid = Object.values(royalties).every((value) => value >= 0 && value <= 1)
    if (!isValuesValid) {
        throw 'Invalid royalty value, it must be a numeric decimal representative of the percentage required ie. 0.05'
    }

    const isSumValid = Object.values(royalties).reduce((acc, val) => acc + val, 0) <= 1
    if (!isSumValid) {
        throw 'Invalid royalty value, the sum of all royalties must be less than or equal to 1'
    }
}

function validateAttributes(attributes: unknown): void {
    if (!Array.isArray(attributes)) {
        throw 'Attributes must be an array'
    }
    const isArrayOfObjects = attributes.every(
        (attribute) => typeof attribute === 'object' && !Array.isArray(attribute) && attribute !== null
    )
    if (!isArrayOfObjects) {
        throw 'Attributes must be an array of objects'
    }
    const isKeysValid = attributes.every(
        (attribute) =>
            Object.keys(attribute).every((key) => key === 'trait_type' || key === 'value') &&
            Object.keys(attribute).filter((key) => key === 'trait_type').length === 1 &&
            Object.keys(attribute).filter((key) => key === 'value').length === 1
    )
    if (!isKeysValid) {
        throw 'Invalid key, attributes must have the keys "trait_type" and "value"'
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
        throw 'Invalid value, "trait_type" must be a non empty string and "value" must be a non empty string or a number'
    }
}
