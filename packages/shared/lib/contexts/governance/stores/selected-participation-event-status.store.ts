import { getAccountsParticipationEventStatusForEvent } from '@contexts/governance/actions'
import { ParticipationEventStatus } from '@iota/wallet'
import { writable } from 'svelte/store'

export const selectedParticipationEventStatus = writable<ParticipationEventStatus>(null)

export async function getAndSetSelectedParticipationEventStatus(eventId: string): Promise<void> {
    selectedParticipationEventStatus.set(await getAccountsParticipationEventStatusForEvent(eventId))
}

export function clearSelectedParticipationEventStatus(): void {
    selectedParticipationEventStatus.set(null)
}
