import { INode } from '../interfaces'

/**
 * Ensures that a list of nodes contains only one primary node. If none exist, one will
 * be selected randomly.
 * @method ensureSinglePrimaryNode
 * @param {INode[]} nodes
 * @returns {INode[]}
 */
export function ensureSinglePrimaryNode(nodes: INode[]): INode[] {
    if (!nodes || !nodes.length) {
        return []
    }

    return nodes

    // const numPrimaryNodes = nodes.filter((n) => n.isPrimary).length
    // if (numPrimaryNodes === 0) {
    //     return setRandomPrimaryNode(nodes)
    // } else if (numPrimaryNodes === 1) {
    //     return nodes
    // } else if (numPrimaryNodes > 1) {
    //     const activeNode = nodes.find((n) => n.isPrimary)
    //     return nodes.map((n, idx) => ({ ...n, isPrimary: n.url === activeNode.url }))
    // }
}
