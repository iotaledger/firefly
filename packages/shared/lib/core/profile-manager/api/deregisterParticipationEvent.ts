import { removeProposalStatus } from '@core/governance'
import { profileManager } from '@core/profile-manager/stores'
import type { EventId } from '@iota/wallet'
import { get } from 'svelte/store'

export async function deregisterParticipationEvent(eventId: EventId): Promise<void> {
    const manager = get(profileManager)
    await removeProposalStatus(eventId)
    return manager.deregisterParticipationEvent(eventId)
}
