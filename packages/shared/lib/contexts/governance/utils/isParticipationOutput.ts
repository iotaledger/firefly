import { PARTICIPATE_TAG_HEX } from '../constants'
import { CommonOutput, Output, TagFeature } from '@iota/sdk/out/types'

export function isParticipationOutput(output: Output): boolean {
    if (output.type === 2) {
        return false
    }

    const commonOutput = output as CommonOutput
    const outputFeature = commonOutput?.features?.find((feature) => feature.type === 3) as TagFeature
    return outputFeature?.tag === PARTICIPATE_TAG_HEX
}
