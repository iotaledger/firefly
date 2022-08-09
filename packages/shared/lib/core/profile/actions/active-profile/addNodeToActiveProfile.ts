import { INode, updateClientOptions } from '@core/network'
import { activeProfile } from '@core/profile/stores'
import { get } from 'svelte/store'

export async function addNodeToActiveProfile(node: INode): Promise<void> {
    const nodes = [...get(activeProfile)?.clientOptions?.nodes, node]
    await updateClientOptions({ nodes })
}
