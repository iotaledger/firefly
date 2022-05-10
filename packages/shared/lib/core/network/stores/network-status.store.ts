import { writable } from 'svelte/store'
import { NetworkStatusDescription } from '../enums'
import { INetworkStatus, IStardustNodeInfo } from '../interfaces'

export const networkStatus = writable<INetworkStatus>({
    messagesPerSecond: 0,
    referencedRate: 0,
    health: 2,
    description: NetworkStatusDescription.Operational,
    currentMilestone: -1,
    nodePlugins: [],
})

export function updateNetworkStatus(values: Partial<INetworkStatus>): void {
    return networkStatus.update((state) => ({ ...state, ...values }))
}
