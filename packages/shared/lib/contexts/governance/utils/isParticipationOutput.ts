import { PARTICIPATE_TAG_HEX } from '../constants'
import { CommonOutput, Output, TagFeature, FeatureType } from '@iota/sdk/out/types'

export function isParticipationOutput(output: Output): boolean {
    const commonOutput = output as CommonOutput
    const outputFeature = commonOutput?.features?.find((feature) => feature.type === FeatureType.Tag) as TagFeature
    return outputFeature?.tag === PARTICIPATE_TAG_HEX
}
