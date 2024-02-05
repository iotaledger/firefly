import { isParticipationOutput } from '@contexts/governance/utils'
import { ReadSpecialStream } from '@core/layer-2'
import { EXTERNALLY_OWNED_ACCOUNT } from '@core/layer-2/constants'
import { parseLayer2MetadataForTransfer } from '@core/layer-2/utils'
import { containsControlCharacters, Converter } from '@core/utils'
import { CommonOutput, FeatureType, MetadataFeature, Output } from '@iota/sdk/out/types'

export function getMetadataFromOutput(output: Output): string | undefined {
    const commonOutput = output as CommonOutput
    const feature = commonOutput?.features?.find((feature) => feature.type === FeatureType.Metadata)
    const metadataFeature = feature as MetadataFeature

    if (metadataFeature) {
        const data = metadataFeature.data ?? undefined

        if (data) {
            const isVotingOutput = isParticipationOutput(output)
            const metadataBytes = Converter.hexToBytes(data)
            const readStream = new ReadSpecialStream(metadataBytes)
            const startValue = readStream.readUInt8('startValue')

            // For smart contract calls the first 8 bits of the metadata
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
}
