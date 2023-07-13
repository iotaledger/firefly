import { CommonOutput, FeatureType, TagFeature } from '@iota/wallet'
import { Converter } from '@core/utils'

export function getTagFromOutput(output: CommonOutput): string | undefined {
    const tagFeature = output?.getFeatures()?.find((feature) => feature.getType() === FeatureType.Tag) as TagFeature
    const tag = tagFeature?.getTag() ?? undefined

    if (tag) {
        return Converter.hexToUtf8(tag)
    }
}
