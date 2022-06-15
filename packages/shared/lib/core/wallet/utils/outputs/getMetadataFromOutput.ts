import { FEATURE_TYPE_METADATA, OUTPUT_TYPE_TREASURY } from '../../constants'
import { IMetadataFeature, OutputTypes } from '@iota/types'

function getMetadataFromOutput(output: OutputTypes): string {
    if (output.type !== OUTPUT_TYPE_TREASURY) {
        const metadataFeature: IMetadataFeature = output?.features?.find(
            (feature) => feature.type === FEATURE_TYPE_METADATA
        )
        return metadataFeature?.data
    }
    return undefined
}
