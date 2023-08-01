import { PARTICIPATE_TAG_HEX } from '../constants'
import { CommonOutput, Output, TagFeature } from '@iota/wallet'
import { FeatureType, OutputType } from '@iota/wallet/out/types'

export function isParticipationOutput(output: Output): boolean {
    if (output.getType() === OutputType.Treasury) {
        return false
    }

    const commonOutput = output as CommonOutput
    const outputFeature = <TagFeature>(
        commonOutput?.getFeatures()?.find((feature) => feature.getType() === FeatureType.Tag)
    )
    return outputFeature?.getTag() === PARTICIPATE_TAG_HEX
}
