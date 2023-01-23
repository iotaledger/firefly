import { get } from 'svelte/store'

import type { ParticipationEventId } from '@iota/wallet'

import { registeredEventIds, removeProposalState } from '@contexts/governance/stores'

import { selectedAccount } from '@core/account/stores'

export async function deregisterParticipationEvent(eventId: ParticipationEventId): Promise<void> {
    const account = get(selectedAccount)
    await account.deregisterParticipationEvent(eventId)

    registeredEventIds.update((ids) => ids.filter((id) => id !== eventId))
    removeProposalState(eventId)
}
