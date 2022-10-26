import { FEATURE_TYPE_METADATA, OUTPUT_TYPE_TREASURY } from '../../constants'
import { IMetadataFeature, OutputTypes } from '@iota/types'
import { Converter } from '@core/utils'

export function getMetadataFromOutput(output: OutputTypes): string {
    if (output && output?.type !== OUTPUT_TYPE_TREASURY) {
        const { data } = <IMetadataFeature>(
            output?.features?.find((feature) => feature.type === FEATURE_TYPE_METADATA)
        ) ?? { data: undefined }
        if (data) {
            return Converter.hexToUtf8(data)
        }
    }
    return undefined
}
