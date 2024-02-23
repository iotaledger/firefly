import { OutputData } from '@iota/sdk/out/types'
import { get } from 'svelte/store'
import { nodeInfo } from '../stores'
import { getManaBalance } from './getManaBalance'
import { api } from '@core/api'

export async function getManaDetailsForOutput(output: OutputData): Promise<number | undefined> {
    const _nodeInfo = get(nodeInfo)
    if (!_nodeInfo || !_nodeInfo.protocolParameters?.[0]?.parameters || !output) return
    const isOutputSpent = output.metadata.spent !== undefined
    const spentOrLatestSlotIndex = isOutputSpent
        ? output.metadata?.spent?.slot
        : _nodeInfo.status?.latestConfirmedBlockSlot ?? undefined
    if (spentOrLatestSlotIndex === undefined) return
    const decayedMana = await api.outputManaWithDecay(
        output.output,
        output.metadata.included.slot,
        spentOrLatestSlotIndex,
        _nodeInfo.protocolParameters[0].parameters
    )

    return getManaBalance(decayedMana)
}
