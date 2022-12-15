import { get } from 'svelte/store'

import { selectedAccount } from '@core/account/stores'

export async function stopVotingForProposal(eventId: string): Promise<void> {
    await get(selectedAccount)?.stopParticipating(eventId)
}
