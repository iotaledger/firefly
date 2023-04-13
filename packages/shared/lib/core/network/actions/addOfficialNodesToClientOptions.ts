import { getOfficialNodes, updateClientOptions } from '@core/network'
import { activeProfile } from '@core/profile'
import { get } from 'svelte/store'

export function addOfficialNodesToClientOptions(): void {
    const { clientOptions, network } = get(activeProfile)
    const currentNodes = clientOptions?.nodes
    const officialNodes = getOfficialNodes(network.id)
    const newOfficialNodes = officialNodes.filter(
        (officialNode) => !currentNodes.some((currentNode) => currentNode.url === officialNode.url)
    )
    const nodes = [...currentNodes, ...newOfficialNodes]
    void updateClientOptions({ nodes })
}
