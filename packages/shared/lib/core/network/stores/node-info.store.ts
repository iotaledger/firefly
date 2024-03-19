import { InfoResponse } from '@iota/sdk/out/types'
import { derived, writable } from 'svelte/store'

export const nodeInfo = writable<InfoResponse | undefined>(undefined)

export function setNodeInfo(newNodeInfo: InfoResponse | undefined): void {
    return nodeInfo.set(newNodeInfo)
}

export const nodeInfoNetworkName = derived(
    nodeInfo,
    ($nodeInfo) => $nodeInfo?.protocolParameters[0]?.parameters?.networkName
)

export const nodeInfoProtocolParameters = derived(nodeInfo, ($nodeInfo) => $nodeInfo?.protocolParameters[0]?.parameters)
export const nodeInfoSecondsPerSlot = derived(
    nodeInfo,
    ($nodeInfo) => $nodeInfo?.protocolParameters[0]?.parameters?.slotDurationInSeconds
)
