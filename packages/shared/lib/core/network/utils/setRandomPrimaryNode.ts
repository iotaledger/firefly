import { INode } from '../interfaces'

export function setRandomPrimaryNode(nodes: INode[]): INode[] {
    const randIdx = Math.floor(Math.random() * nodes.length)
    return nodes.map((n, idx) => ({ ...n, isPrimary: idx === randIdx }))
}
