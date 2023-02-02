import { selectedAccount } from '@core/account'
import { get } from 'svelte/store'

export async function isProposalAlreadyAddedForSelectedAccount(proposalId: string): Promise<boolean> {
    const events = await get(selectedAccount).getParticipationEvents()
    return Object.keys(events).some((eventId) => eventId === proposalId)
}
