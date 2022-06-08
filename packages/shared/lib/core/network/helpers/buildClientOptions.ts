import { IClientOptions, INetwork, INode } from '../interfaces'

export function buildClientOptions(network: INetwork, nodes: INode[], automaticNodeSelection: boolean): IClientOptions {
    return {
        nodes,
        automaticNodeSelection,
    }
}
