import { networkHrp } from '@core/network'
import { IIrc27Metadata, MimeType, SupportedMimeType } from '@core/nfts'
import { isValidUri, validateBech32Address } from '@core/utils'
import { Converter } from '@core/utils/convert'
import { TokenStandard } from '@core/wallet'
import { get } from 'svelte/store'

export function parseNftMetadata(metadata: string): IIrc27Metadata | string {
    try {
        const convertedData = Converter.hexToUtf8(metadata)
        if (!convertedData.includes(`"standard":"${TokenStandard.IRC27}"`)) {
            return JSON.stringify(JSON.parse(convertedData), null, 2)
        }

        const parsedData = metadata ? JSON.parse(Converter.hexToUtf8(metadata)) : {}
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
        validateRoyalties(data)
    }

    if (data.attributes) {
        validateAttributes(data)
    }
}

function validateRoyalties(data: IIrc27Metadata): void {
    const isKeysValid = Object.keys(data.royalties).every((key) => !validateBech32Address(get(networkHrp), key))
    if (!isKeysValid) {
        throw `Invalid royalty address, must be a valid ${get(networkHrp)} address where royalties will be sent to.`
    }

    const isValuesValid = Object.values(data.royalties).every((value) => value >= 0 && value <= 1)
    if (!isValuesValid) {
        throw 'Invalid royalty value, it must be a numeric decimal representative of the percentage required ie. 0.05'
    }

    const isSumValid = Object.values(data.royalties).reduce((acc, val) => acc + val, 0) <= 1
    if (!isSumValid) {
        throw 'Invalid royalty value, the sum of all royalties must be less than or equal to 1'
    }
}

function validateAttributes(data: IIrc27Metadata): void {
    if (!Array.isArray(data.attributes)) {
        throw 'Attributes must be an array'
    }
    const isArrayOfObjects = data.attributes.every(
        (attribute) => typeof attribute === 'object' && !Array.isArray(attribute) && attribute !== null
    )
    if (!isArrayOfObjects) {
        throw 'Attributes must be an array of objects'
    }
    const isKeysValid = data.attributes.every(
        (attribute) =>
            Object.keys(attribute).every((key) => key === 'trait_type' || key === 'value') &&
            Object.keys(attribute).filter((key) => key === 'trait_type').length === 1 &&
            Object.keys(attribute).filter((key) => key === 'value').length === 1
    )
    if (!isKeysValid) {
        throw 'Invalid key, attributes must have the keys "trait_type" and "value"'
    }
    const isValuesValid = data.attributes.every(
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
