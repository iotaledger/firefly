import { INodeInfo } from '@iota/sdk/out/types'
import { derived, writable } from 'svelte/store'

export const nodeInfo = writable<INodeInfo | undefined>(undefined)

export function setNodeInfo(newNodeInfo: INodeInfo | undefined): void {
    return nodeInfo.set(newNodeInfo)
}

export const nodeInfoNetworkName = derived(
    nodeInfo,
    ($nodeInfo) => $nodeInfo?.protocolParameters[0]?.parameters?.networkName
)
