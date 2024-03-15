import { NetworkMetricsResponse } from '@iota/sdk/out/types'
import { writable } from 'svelte/store'

export const networkMetrics = writable<NetworkMetricsResponse | undefined>(undefined)

export function setNetworkMetrics(newNetworkMetrics: NetworkMetricsResponse | undefined): void {
    return networkMetrics.set(newNetworkMetrics)
}
