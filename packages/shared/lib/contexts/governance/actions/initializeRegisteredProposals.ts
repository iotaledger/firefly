import { activeAccounts } from '@core/profile'
import { get } from 'svelte/store'
import { IRegisteredProposals } from '../interfaces'
import { registeredProposals } from '../stores'
import { createProposalFromEvent } from '../utils'

export async function initializeRegisteredProposals(): Promise<void> {
    const allProposals: { [accountId: number]: IRegisteredProposals } = {}

    for (const account of get(activeAccounts)) {
        const events = await account.getParticipationEvents()

        for (const event of Object.values(events)) {
            if (!allProposals[account.index]) {
                allProposals[account.index] = {}
            }
            allProposals[account.index][event.id] = createProposalFromEvent(event)
        }
    }
    registeredProposals.set(allProposals)
}
