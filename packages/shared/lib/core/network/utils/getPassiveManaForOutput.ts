import { api } from '@core/api'
import { OutputData } from '@iota/sdk/out/types'
import { get } from 'svelte/store'
import { nodeInfo } from '../stores'
import { getManaBalance } from './getManaBalance'

/**
 * Get the passive mana for an output, it does not include BIC nor staking/delegation rewards
 * @param output The output to get the mana for.
 * @returns The passive mana for the output.
 */
export function getPassiveManaForOutput(output: OutputData): number | undefined {
    const _nodeInfo = get(nodeInfo)
    if (!_nodeInfo || !_nodeInfo.protocolParameters?.[0]?.parameters || !output) return
    const isOutputSpent = output.metadata.spent !== undefined
    const spentOrLatestSlotIndex = isOutputSpent
        ? output.metadata?.spent?.slot
        : _nodeInfo.status?.latestConfirmedBlockSlot ?? undefined
    if (spentOrLatestSlotIndex === undefined) return
    const decayedMana = api.outputManaWithDecay(
        output.output,
        output.metadata.included.slot,
        spentOrLatestSlotIndex,
        _nodeInfo.protocolParameters[0].parameters
    )
    return getManaBalance(decayedMana)
}
