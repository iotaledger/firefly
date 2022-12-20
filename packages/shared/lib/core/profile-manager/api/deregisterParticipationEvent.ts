import { get } from 'svelte/store'

import type { EventId } from '@iota/wallet'

import { registeredEventIds, removeProposalState } from '@contexts/governance/stores'

import { profileManager } from '../stores'

export async function deregisterParticipationEvent(eventId: EventId): Promise<void> {
    const manager = get(profileManager)
    await manager.deregisterParticipationEvent(eventId)

    registeredEventIds.update((ids) => ids.filter((id) => id !== eventId))
    removeProposalState(eventId)
}
