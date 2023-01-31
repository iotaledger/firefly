import { get } from 'svelte/store'
import { selectedAccount } from '@core/account/stores'
import type { ParticipationEventWithNodes } from '@iota/wallet/out/types'

export function getVotingEvents(): Promise<{ [eventId: string]: ParticipationEventWithNodes }> {
    const account = get(selectedAccount)
    return account?.getParticipationEvents()
}
