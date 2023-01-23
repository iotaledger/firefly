import { get } from 'svelte/store'
import type { ParticipationEvent } from '@iota/wallet'
import { selectedAccount } from '@core/account/stores'

export function getVotingEvents(): Promise<ParticipationEvent[]> {
    const account = get(selectedAccount)
    return account?.getParticipationEvents()
}
