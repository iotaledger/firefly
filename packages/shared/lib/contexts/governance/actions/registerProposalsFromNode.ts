import { get } from 'svelte/store'

import { selectedAccount } from '@core/account/stores'
import { INode } from '@core/network/interfaces'

import { registerParticipationEvents } from './registerParticipationEvents'

export async function registerProposalsFromNode(node: INode): Promise<void> {
    const options = {
        node,
    }
    await registerParticipationEvents(options, get(selectedAccount))
}
