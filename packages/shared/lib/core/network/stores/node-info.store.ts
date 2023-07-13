import { INodeInfo } from '@iota/wallet'
import { writable } from 'svelte/store'

export const nodeInfo = writable<INodeInfo | undefined>(undefined)

export function setNodeInfo(newNodeInfo: INodeInfo | undefined): void {
    return nodeInfo.set(newNodeInfo)
}
