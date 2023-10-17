import { DEFAULT_MAX_PARALLEL_API_REQUESTS } from '../constants'
import { NetworkId } from '../enums'
import { ClientOptions } from '../interfaces'
import { getOfficialNodes } from './getOfficialNodes'

export function getDefaultClientOptions(networkId: NetworkId): ClientOptions {
    const nodes = getOfficialNodes(networkId)
    return {
        nodes,
        maxParallelApiRequests: DEFAULT_MAX_PARALLEL_API_REQUESTS,
    }
}
