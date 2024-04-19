import { getNetworkMetrics } from '@core/wallet/actions'
import { NetworkMetricsResponse } from '@iota/sdk/out/types'
import { setNetworkMetrics } from '../stores'

export async function getAndUpdateNetworkMetrics(forwardErrors = false): Promise<NetworkMetricsResponse | undefined> {
    let networkMetricsResponse: NetworkMetricsResponse
    try {
        networkMetricsResponse = await getNetworkMetrics()
        setNetworkMetrics(networkMetricsResponse)
        return networkMetricsResponse
    } catch (err) {
        setNetworkMetrics(undefined)
        if (forwardErrors) {
            return Promise.reject(err)
        } else {
            console.error(err)
        }
    }
}
