import { INode } from '@core/network/interfaces'
import { registerProposalsFromNode } from '@contexts/governance'

export async function registerProposalsFromNodes(nodes: INode[]): Promise<void> {
    await Promise.all(nodes.map((node) => registerProposalsFromNode(node)))
}
