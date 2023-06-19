import { INode, updateClientOptions } from '@core/network'
import { activeProfile } from '@core/profile/stores'
import { get } from 'svelte/store'

export async function editNodeInClientOptions(currentNode: INode, node: INode): Promise<void> {
    const clientOptions = get(activeProfile)?.clientOptions
    const newNode = clientOptions?.nodes?.find((_node) => _node.url === currentNode.url)
    if (newNode) {
        Object.assign(newNode, node)
        await updateClientOptions(clientOptions)
    }
}
