import { INode, updateClientOptions } from '@core/network'
import { activeProfile } from '@core/profile'
import { get } from 'svelte/store'

export async function toggleDisabledNodeInClientOptions(node: INode): Promise<void> {
    const clientOptions = get(activeProfile)?.clientOptions
    const editedNode = clientOptions.nodes.find((_node) => _node.url === node.url)
    editedNode.disabled = !editedNode.disabled
    await updateClientOptions({ nodes: clientOptions.nodes })
}
