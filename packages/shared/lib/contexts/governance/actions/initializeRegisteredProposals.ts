import { IAccountState, selectedAccount } from '@core/account'
import { activeAccounts } from '@core/profile'
import { get } from 'svelte/store'
import { IRegisteredProposals } from '../interfaces'
import { registeredProposals } from '../stores'
import { createProposalFromEvent } from '../utils'

export async function initializeRegisteredProposals(): Promise<void> {
    const allProposals: { [accountId: number]: IRegisteredProposals } = {}

    // Get selected account first to speed up showing proposals for the user
    const _selectedAccount = get(selectedAccount)
    allProposals[_selectedAccount.index] = await getParticipationEventsAndCreateProposalsForAccount(_selectedAccount)
    registeredProposals.set(allProposals)

    // Then get the rest of the accounts in the background
    for (const account of get(activeAccounts)) {
        if (account.index !== _selectedAccount.index) {
            allProposals[account.index] = await getParticipationEventsAndCreateProposalsForAccount(account)
        }
    }
    registeredProposals.set(allProposals)
}

async function getParticipationEventsAndCreateProposalsForAccount(
    account: IAccountState
): Promise<IRegisteredProposals> {
    const proposals: IRegisteredProposals = {}
    const events = await account.getParticipationEvents()
    for (const event of Object.values(events)) {
        proposals[event.id] = createProposalFromEvent(event)
    }
    return proposals
}
