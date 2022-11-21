import { FEATURE_TYPE_METADATA } from '../../../constants'
import { IMetadataFeature } from '@iota/types'
import { Output } from '@core/wallet/types'
import { Converter } from '@core/utils'
import { parseLayer2MetadataForTransfer } from '@core/layer-2'

export function getMetadataFromOutput(output: Output): string {
    const { data } = <IMetadataFeature>output?.features?.find((feature) => feature.type === FEATURE_TYPE_METADATA) ?? {
        data: undefined,
    }
    if (data) {
        const metadataBytes = Converter.hexToBytes(data.substring(2))
        if (metadataBytes.includes(0)) {
            // TODO, optimal way to figure out if bytes contain non-ASCII character
            // https://www.utf8-chartable.de/
            parseLayer2MetadataForTransfer(metadataBytes)
        }
        return Converter.hexToUtf8(data)
    }
}
