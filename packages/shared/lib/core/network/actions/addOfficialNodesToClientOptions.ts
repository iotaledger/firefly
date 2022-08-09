import { getOfficialNodes, updateClientOptions } from '@core/network'
import { activeProfile } from '@core/profile'
import { get } from 'svelte/store'

export function addOfficialNodesToClientOptions(): void {
    const { clientOptions, networkProtocol, networkType } = get(activeProfile)
    const currentNodes = clientOptions?.nodes
    const officialNodes = getOfficialNodes(networkProtocol, networkType)
    const newOfficialNodes = officialNodes.filter(
        (officialNode) => !currentNodes.some((currentNode) => currentNode.url === officialNode.url)
    )
    const nodes = [...currentNodes, ...newOfficialNodes]
    void updateClientOptions({ nodes })
}
