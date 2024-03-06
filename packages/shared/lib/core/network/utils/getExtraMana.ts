import { nodeInfoProtocolParameters } from '../stores'
import { get } from 'svelte/store'

export function getExtraMana(numberOfExtraSlots: number): number {
    if (!get(nodeInfoProtocolParameters)) {
        return 0
    } else {
        // Price per block increases linearly with number of slots
        return (
            numberOfExtraSlots *
            Number(get(nodeInfoProtocolParameters).congestionControlParameters.increase) *
            Number(get(nodeInfoProtocolParameters).workScoreParameters.block)
        )
    }
}
