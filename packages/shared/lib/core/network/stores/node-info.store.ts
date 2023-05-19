import type { INodeInfo } from '@iota/types'
import { writable } from 'svelte/store'

export const nodeInfo = writable<INodeInfo | undefined>(undefined)

export function setNodeInfo(newNodeInfo: INodeInfo | undefined): void {
    return nodeInfo.set(newNodeInfo)
}
