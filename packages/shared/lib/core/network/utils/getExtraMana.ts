import { nodeInfoProtocolParameters } from '../stores'
import { get } from 'svelte/store'

export function getExtraMana(numberOfExtraSlots: number): number {
    const protocolParameters = get(nodeInfoProtocolParameters)
    if (!protocolParameters) {
        return 0
    } else {
        // Price per block increases linearly with number of slots
        return (
            numberOfExtraSlots *
            Number(protocolParameters.congestionControlParameters.increase) *
            Number(protocolParameters.workScoreParameters.block)
        )
    }
}
