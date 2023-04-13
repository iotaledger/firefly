import { INode, updateClientOptions } from '@core/network'
import { activeProfile } from '@core/profile/stores'
import { get } from 'svelte/store'

export async function addNodeToClientOptions(node: INode): Promise<void> {
    const clientNodes = get(activeProfile)?.clientOptions?.nodes ?? []
    const nodes = [...clientNodes, node]
    await updateClientOptions({ nodes })
}
