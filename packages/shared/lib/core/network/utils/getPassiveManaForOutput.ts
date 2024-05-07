import { api } from '@core/api'
import { OutputData } from '@iota/sdk/out/types'
import { get } from 'svelte/store'
import { nodeInfo } from '../stores'
import { getManaBalance } from './getManaBalance'

/**
 * Get the passive mana for an output, it does not include BIC nor staking/delegation rewards
 * @param output The output to get the mana for.
 * @param slotIndex The slot number up to where calculate the mana.
 * @returns The passive mana for the output.
 */
export function getPassiveManaForOutput(output: OutputData, slotIndex?: number): number | undefined {
    const _nodeInfo = get(nodeInfo)
    if (!_nodeInfo || !_nodeInfo.protocolParameters?.[0]?.parameters || !output) return
    if (!slotIndex) {
        const isOutputSpent = output.metadata.spent !== undefined
        slotIndex = isOutputSpent
            ? output.metadata?.spent?.slot
            : _nodeInfo.status?.latestConfirmedBlockSlot ?? undefined
    }
    if (slotIndex === undefined) return

    const includedSlot = api.computeSlotIndex(output.metadata.included.transactionId)
    const decayedMana = api.outputManaWithDecay(
        output.output,
        includedSlot,
        slotIndex,
        _nodeInfo.protocolParameters[0].parameters
    )
    return getManaBalance(decayedMana)
}
