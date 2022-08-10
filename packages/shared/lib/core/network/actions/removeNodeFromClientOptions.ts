import { INode, updateClientOptions } from '@core/network'
import { activeProfile } from '@core/profile'
import { get } from 'svelte/store'

export async function removeNodeFromClientOptions(node: INode): Promise<void> {
    const clientOptions = get(activeProfile)?.clientOptions
    if (clientOptions?.nodes?.length > 1) {
        const remainingNodes = clientOptions?.nodes?.filter((n) => n.url !== node.url)
        const primaryNode = clientOptions?.primaryNode?.url === node.url ? null : clientOptions?.primaryNode
        await updateClientOptions({ nodes: remainingNodes, primaryNode })
    } else {
        return Promise.reject('Cannot remove last node')
    }
}
