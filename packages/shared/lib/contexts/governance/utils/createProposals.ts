import { getVotingEvents } from '@core/profile-manager/api'
import { IProposal } from '../interfaces'
import { createProposalFromEvent } from '..'

export async function createProposals(): Promise<IProposal[]> {
    const events = await getVotingEvents()
    const proposals: IProposal[] = await Promise.all(events?.map(async (event) => createProposalFromEvent(event)))
    return proposals
}
