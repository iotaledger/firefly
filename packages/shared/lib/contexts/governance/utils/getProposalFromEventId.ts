import { getVotingEvents } from '@core/profile-manager/api'
import { IProposal } from '../interfaces'
import { createProposalFromEvent } from './createProposalsFromEvents'

export async function getProposalFromEventId(eventId: string): Promise<IProposal> {
    const events = await getVotingEvents()
    const event = events.find((event) => event.id === eventId)
    return createProposalFromEvent(event)
}
