import { ClientOptions } from '@iota/wallet'
import { INetwork, INode } from '../interfaces'

export function buildClientOptions(network: INetwork, nodes: INode[]): ClientOptions {
    return {
        nodes,
    }
}
