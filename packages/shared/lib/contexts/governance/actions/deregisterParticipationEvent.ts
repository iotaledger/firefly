import { get } from 'svelte/store'

import type { ParticipationEventId } from '@iota/wallet'

import { selectedAccount } from '@core/account/stores'

import { registeredEventIds, removeProposalState } from '../stores'

export async function deregisterParticipationEvent(eventId: ParticipationEventId): Promise<void> {
    const account = get(selectedAccount)
    await account.deregisterParticipationEvent(eventId)

    registeredEventIds.update((ids) => ids.filter((id) => id !== eventId))
    removeProposalState(eventId)
}
