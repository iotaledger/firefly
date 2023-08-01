import { isParticipationOutput } from '@contexts/governance/utils'
import { EXTERNALLY_OWNED_ACCOUNT } from '@core/layer-2/constants'
import { parseLayer2MetadataForTransfer } from '@core/layer-2/utils'
import { containsControlCharacters, Converter } from '@core/utils'
import { CommonOutput, FeatureType, MetadataFeature, Output, OutputType } from '@iota/wallet/out/types'

export function getMetadataFromOutput(output: Output): string | undefined {
    if (output.getType() === OutputType.Treasury) {
        return undefined
    }

    const commonOutput = output as CommonOutput
    const feature = commonOutput?.getFeatures()?.find((feature) => feature.getType() === FeatureType.Metadata)
    const metadataFeature = feature as MetadataFeature
    const data = metadataFeature.getData() ?? undefined

    if (data) {
        const isVotingOutput = isParticipationOutput(output)
        const metadataBytes = Converter.hexToBytes(data)
        const startValue = Number(data.substring(0, 10))

        // For smart contract calls the first 32 bits of the metadata
        // correspond to 0 if an an end-user initiates the transaction
        // instead of a smart contract. A stop voting output could
        // also start with a 0 metadata, so we check that as well.
        const isLayer2Output = startValue === EXTERNALLY_OWNED_ACCOUNT && !isVotingOutput
        if (isLayer2Output) {
            try {
                const layer2Data = parseLayer2MetadataForTransfer(metadataBytes)
                return JSON.stringify(layer2Data)
            } catch (err) {
                console.error(err)
                return data
            }
        } else if (isVotingOutput) {
            return data
        } else {
            const convertedString = Converter.hexToUtf8(data)
            return containsControlCharacters(convertedString) ? data : convertedString
        }
    }
}
