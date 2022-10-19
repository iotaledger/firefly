import { FEATURE_TYPE_TAG, OUTPUT_TYPE_TREASURY } from '../../../constants'
import { ITagFeature, OutputTypes } from '@iota/types'
import { Converter } from '@lib/converter'

export function getTagFromOutput(output: OutputTypes): string {
    if (output && output?.type !== OUTPUT_TYPE_TREASURY) {
        const { tag } = <ITagFeature>output?.features?.find((feature) => feature.type === FEATURE_TYPE_TAG) ?? {
            tag: undefined,
        }
        if (tag) {
            return Converter.hexToUtf8(tag)
        }
    }
    return undefined
}
