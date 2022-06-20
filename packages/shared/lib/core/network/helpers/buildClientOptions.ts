import { IClientOptions, INode } from '../interfaces'

export function buildClientOptions(nodes: INode[]): IClientOptions {
    return {
        nodes,
    }
}
