import { get } from 'svelte/store'
import type { EventId } from '@iota/wallet'
import { registeredProposalsIds, removeProposalState } from '@core/governance'
import { profileManager } from '../stores'

export async function deregisterParticipationEvent(eventId: EventId): Promise<void> {
    const manager = get(profileManager)
    await manager.deregisterParticipationEvent(eventId)

    registeredProposalsIds.update((ids) => ids.filter((id) => id !== eventId))
    removeProposalState(eventId)
}
