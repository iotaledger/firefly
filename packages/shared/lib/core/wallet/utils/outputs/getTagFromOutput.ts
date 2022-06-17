import { FEATURE_TYPE_TAG, OUTPUT_TYPE_TREASURY } from '../../constants'
import { ITagFeature, OutputTypes } from '@iota/types'

export function getTagFromOutput(output: OutputTypes): string {
    if (output && output.type !== OUTPUT_TYPE_TREASURY) {
        const tagFeature = <ITagFeature>output?.features?.find((feature) => feature.type === FEATURE_TYPE_TAG)
        return tagFeature?.tag
    } else {
        return undefined
    }
}
