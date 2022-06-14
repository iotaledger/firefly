import { IClientOptions, INetwork, INode } from '../interfaces'

export function buildClientOptions(network: INetwork, nodes: INode[]): IClientOptions {
    return {
        nodes,
    }
}
