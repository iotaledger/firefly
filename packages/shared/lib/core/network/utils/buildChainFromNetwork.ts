import { IConnectedChain } from '../interfaces'
import { NetworkHealth } from '../enums'

export function buildChainFromNetwork(name: string, address: string, status: NetworkHealth): IConnectedChain {
    return {
        name,
        address,
        status,
    }
}
