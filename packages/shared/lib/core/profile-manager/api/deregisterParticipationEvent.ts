import { profileManager } from '@core/profile-manager/stores'
import type { EventId } from '@iota/wallet'
import { get } from 'svelte/store'

export function deregisterParticipationEvent(eventId: EventId): Promise<void> {
    const manager = get(profileManager)
    return manager.deregisterParticipationEvent(eventId)
}
