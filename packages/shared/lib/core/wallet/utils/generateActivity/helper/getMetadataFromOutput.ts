import { FEATURE_TYPE_METADATA } from '../../../constants'
import { ICommonOutput, IMetadataFeature } from '@iota/types'
import { Converter } from '@lib/converter'

export function getMetadataFromOutput(output: ICommonOutput): string {
    const { data } = <IMetadataFeature>output?.features?.find((feature) => feature.type === FEATURE_TYPE_METADATA) ?? {
        data: undefined,
    }
    if (data) {
        return Converter.hexToUtf8(data)
    }
}
