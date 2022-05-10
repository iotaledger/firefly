import { INode } from '../interfaces'
import { cleanAuth } from './cleanAuth'

/**
 * Strips a node of its authentication data accordingly as some nodes return errors
 * whenever an undefined or empty field is provided.
 *
 * @method cleanNodeAuthOfNode
 * @param {INode} node
 * @returns {INode}
 *
 */
export function cleanNodeAuth(node: INode): INode {
    return { ...node, auth: cleanAuth(node?.auth) }
}
