import { FEATURE_TYPE_TAG } from '../../../constants'
import { ITagFeature, IBasicOutput, IAliasOutput, IFoundryOutput, INftOutput } from '@iota/types'
import { Converter } from '@lib/converter'

export function getTagFromOutput(output: IBasicOutput | IAliasOutput | IFoundryOutput | INftOutput): string {
    const { tag } = <ITagFeature>output?.features?.find((feature) => feature.type === FEATURE_TYPE_TAG) ?? {
        tag: undefined,
    }
    if (tag) {
        return Converter.hexToUtf8(tag)
    }
}
