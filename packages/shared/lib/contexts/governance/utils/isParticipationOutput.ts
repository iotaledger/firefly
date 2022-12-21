import type { ITagFeature } from '@iota/types'

import { FEATURE_TYPE_TAG, Output } from '@core/wallet'

import { PARTICIPATE_TAG_HEX } from '../constants'

export function isParticipationOutput(output: Output): boolean {
    const outputFeature = <ITagFeature>output?.features?.find((feature) => feature.type === FEATURE_TYPE_TAG)
    return outputFeature?.tag === PARTICIPATE_TAG_HEX
}
