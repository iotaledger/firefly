import { get } from 'svelte/store'
import type { EventId } from '@iota/wallet'
import { removeProposalState } from '@core/governance'
import { profileManager } from '../stores'

export function deregisterParticipationEvent(eventId: EventId): Promise<void> {
    const manager = get(profileManager)
    removeProposalState(eventId)
    return manager.deregisterParticipationEvent(eventId)
}
