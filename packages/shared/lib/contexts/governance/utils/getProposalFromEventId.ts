import { getVotingEvents } from '@contexts/governance/actions'
import { IProposal } from '../interfaces'
import { createProposalFromEvent } from './createProposalFromEvent'

export async function getProposalFromEventId(eventId: string): Promise<IProposal> {
    const events = await getVotingEvents()
    const event = events[eventId]
    /**
     * NOTE: If createProposalFromEvent function starts having stateful behavior (store, persist value) then we should refactor this function to not use it.
     */
    if (event === undefined) {
        throw new Error(`Event with id ${eventId} not found`)
    } else {
        return createProposalFromEvent(event)
    }
}
