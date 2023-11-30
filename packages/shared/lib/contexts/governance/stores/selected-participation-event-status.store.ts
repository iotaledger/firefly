import { ParticipationEventStatus } from '@iota/sdk/out/types'
import { selectedWalletId } from 'shared/lib/core/wallet'
import { get, writable } from 'svelte/store'
import { getWalletsParticipationEventStatusForEvent } from '../actions'
import { createProposalFromError } from '../utils'
import { addOrUpdateProposalToRegisteredProposals, registeredProposals } from './registered-proposals.store'

export const selectedParticipationEventStatus = writable<ParticipationEventStatus>(null)

export async function getAndSetSelectedParticipationEventStatus(eventId: string): Promise<void> {
    let eventStatus: ParticipationEventStatus
    try {
        eventStatus = await getWalletsParticipationEventStatusForEvent(eventId)
    } catch (err) {
        const walletId = get(selectedWalletId)
        const proposal = get(registeredProposals)[walletId][eventId]
        const errorProposal = createProposalFromError(proposal, err)
        addOrUpdateProposalToRegisteredProposals(errorProposal, walletId)
    }
    selectedParticipationEventStatus.set(eventStatus)
}

export function clearSelectedParticipationEventStatus(): void {
    selectedParticipationEventStatus.set(null)
}
