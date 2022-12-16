import { FEATURE_TYPE_METADATA } from '../../../constants'
import { IMetadataFeature } from '@iota/types'
import { Output } from '@core/wallet/types'
import { containsControlCharacters, Converter } from '@core/utils'
import { EXTERNALLY_OWNED_ACCOUNT, parseLayer2MetadataForTransfer } from '@core/layer-2'

export function getMetadataFromOutput(output: Output): string {
    const { data } = <IMetadataFeature>output?.features?.find((feature) => feature.type === FEATURE_TYPE_METADATA) ?? {
        data: undefined,
    }
    if (data) {
        const metadataBytes = Converter.hexToBytes(data.substring(2))
        const startValue = Number(data.substring(0, 10))

        // For smart contract calls the first 32 bits of the metadata
        // correspond to 0 if an an end-user initiates the transaction
        // instead of a smart contract
        if (startValue === EXTERNALLY_OWNED_ACCOUNT) {
            try {
                const layer2Data = parseLayer2MetadataForTransfer(metadataBytes)
                return JSON.stringify(layer2Data)
            } catch (err) {
                console.error(err)
                return data
            }
        } else {
            const convertedString = Converter.hexToUtf8(data)
            return containsControlCharacters(convertedString) ? data : convertedString
        }
    }
}
