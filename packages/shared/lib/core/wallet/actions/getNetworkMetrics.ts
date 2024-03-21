import { NetworkMetricsResponse } from '@iota/sdk/out/types'
import { getClient } from './getClient'

export async function getNetworkMetrics(): Promise<NetworkMetricsResponse> {
    const client = await getClient()
    return client.getNetworkMetrics()
}
