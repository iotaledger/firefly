import { get } from 'svelte/store'

import { IWalletState } from '@core/wallet/interfaces'
import { INode } from '@core/network/interfaces'
import { activeProfile } from '@core/profile/stores'

import { registerProposalsForWallets } from './registerProposalsForWallets'

// TODO(2.0) FIx this
export async function registerProposalsFromNodes(accounts: IWalletState[], nodes?: INode[]): Promise<void> {
    const _nodes = nodes ? nodes : get(activeProfile)?.clientOptions?.nodes
    await Promise.all(_nodes.map((node) => registerProposalsForWallets({ node }, accounts)))
}
