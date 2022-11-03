import { FEATURE_TYPE_TAG } from '../../../constants'
import { ITagFeature } from '@iota/types'
import { Converter } from '@core/utils'
import { Output } from '@core/wallet/types'

export function getTagFromOutput(output: Output): string {
    const { tag } = <ITagFeature>output?.features?.find((feature) => feature.type === FEATURE_TYPE_TAG) ?? {
        tag: undefined,
    }
    if (tag) {
        return Converter.hexToUtf8(tag)
    }
}
