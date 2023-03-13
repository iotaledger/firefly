import { ParticipationEventStatus } from '@iota/wallet'
import { get, writable } from 'svelte/store'
import { selectedAccountIndex } from '@core/account/stores'
import { getAccountsParticipationEventStatusForEvent } from '../actions'
import { createProposalFromError } from '../utils'
import { addOrUpdateProposalToRegisteredProposals, registeredProposals } from './registered-proposals.store'

export const selectedParticipationEventStatus = writable<ParticipationEventStatus>(null)

export async function getAndSetSelectedParticipationEventStatus(eventId: string): Promise<void> {
    let eventStatus: ParticipationEventStatus
    try {
        eventStatus = await getAccountsParticipationEventStatusForEvent(eventId)
    } catch (err) {
        const accountIndex = get(selectedAccountIndex)
        const proposal = get(registeredProposals)[accountIndex][eventId]
        const errorProposal = createProposalFromError(proposal, err)
        addOrUpdateProposalToRegisteredProposals(errorProposal, accountIndex)
    }
    selectedParticipationEventStatus.set(eventStatus)
}

export function clearSelectedParticipationEventStatus(): void {
    selectedParticipationEventStatus.set(null)
}
