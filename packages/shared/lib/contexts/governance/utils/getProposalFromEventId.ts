import { getVotingEvents } from '@contexts/governance/actions'
import { IProposal } from '../interfaces'
import { createProposalFromEvent } from '..'

export async function getProposalFromEventId(eventId: string): Promise<IProposal> {
    const events = await getVotingEvents()
    const event = events.find((event) => event.id === eventId)
    /**
     * NOTE: If createProposalFromEvent function starts having stateful behavior (store, persist value) then we should refactor this function to not use it.
     */
    return createProposalFromEvent(event)
}
