import { CommonOutput, FeatureType, TagFeature } from '@iota/wallet/out/types'
import { Converter } from '@core/utils'

export function getTagFromOutput(output: CommonOutput): string | undefined {
    const tagFeature = output?.features?.find((feature) => feature.type === FeatureType.Tag) as TagFeature
    const tag = tagFeature?.tag ?? undefined

    if (tag) {
        return Converter.hexToUtf8(tag)
    }
}
