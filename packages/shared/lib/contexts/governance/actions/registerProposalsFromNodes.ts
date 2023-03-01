import { get } from 'svelte/store'

import { IAccountState } from '@core/account/interfaces'
import { INode } from '@core/network/interfaces'
import { activeProfile } from '@core/profile/stores'

import { registerProposalsForAccounts } from './registerProposalsForAccounts'

export async function registerProposalsFromNodes(accounts: IAccountState[], nodes?: INode[]): Promise<void> {
    const _nodes = nodes ? nodes : get(activeProfile)?.clientOptions?.nodes
    await Promise.all(_nodes.map((node) => registerProposalsForAccounts({ node }, accounts)))
}
