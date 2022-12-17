import { get } from 'svelte/store'

import { Transaction } from '@iota/wallet'

import { selectedAccount } from '@core/account/stores'

export function stopVotingForProposal(eventId: string): Promise<Transaction> {
    return get(selectedAccount)?.stopParticipating(eventId)
}
