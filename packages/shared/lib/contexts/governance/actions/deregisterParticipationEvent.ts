import { get } from 'svelte/store'
import type { ParticipationEventId } from '@iota/wallet'
import { selectedAccount } from '@core/account/stores'
import { clearSelectedParticipationEventStatus, removePersistedProposal } from '../stores'

export async function deregisterParticipationEvent(eventId: ParticipationEventId): Promise<void> {
    const account = get(selectedAccount)
    await account.deregisterParticipationEvent(eventId)

    removePersistedProposal(eventId, account.index)
    clearSelectedParticipationEventStatus()
}
