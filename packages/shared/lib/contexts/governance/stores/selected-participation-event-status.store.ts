import { getAccountsParticipationEventStatusForEvent } from '@contexts/governance/actions'
import { ParticipationEventStatus } from '@iota/wallet'
import { writable } from 'svelte/store'

export const selectedParticipationEventStatus = writable<ParticipationEventStatus>(null)

export async function getAndSetSelectedParticipationEventStatus(eventId: string): Promise<void> {
    let eventStatus: ParticipationEventStatus
    try {
        eventStatus = await getAccountsParticipationEventStatusForEvent(eventId)
    } catch (error) {
        eventStatus = undefined
    }
    selectedParticipationEventStatus.set(eventStatus)
}

export function clearSelectedParticipationEventStatus(): void {
    selectedParticipationEventStatus.set(null)
}
