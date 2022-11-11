import { FEATURE_TYPE_METADATA } from '../../../constants'
import { IMetadataFeature } from '@iota/types'
import { Output } from '@core/wallet/types'

export function getMetadataFromOutput(output: Output): string {
    const { data } = <IMetadataFeature>output?.features?.find((feature) => feature.type === FEATURE_TYPE_METADATA) ?? {
        data: undefined,
    }
    if (data) {
        return data
    }
}
