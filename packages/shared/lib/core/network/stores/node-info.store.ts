import { INodeInfo } from '@iota/sdk/out/types'
import { writable, derived } from 'svelte/store'

export const nodeInfo = writable<INodeInfo | undefined>(undefined)

export function setNodeInfo(newNodeInfo: INodeInfo | undefined): void {
    return nodeInfo.set(newNodeInfo)
}

export const nodeInfoBaseToken = derived(nodeInfo, ($nodeInfo) => $nodeInfo?.baseToken)

export const nodeInfoProtocol = derived(nodeInfo, ($nodeInfo) => $nodeInfo?.protocol)
