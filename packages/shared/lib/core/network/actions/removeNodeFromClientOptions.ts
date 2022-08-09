import { INode, updateClientOptions } from '@core/network'
import { activeProfile } from '@core/profile'
import { get } from 'svelte/store'

export function removeNodeFromClientOptions(node: INode): void {
    const clientOptions = get(activeProfile)?.clientOptions
    if (clientOptions?.nodes?.length > 1) {
        const newNodes = clientOptions?.nodes?.filter((n) => n.url !== node.url)
        clientOptions.nodes = newNodes
        updateClientOptions(clientOptions)
    } else {
        throw Error('Cannot remove last node')
    }
}
