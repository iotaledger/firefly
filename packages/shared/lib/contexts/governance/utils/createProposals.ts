import type { ParticipationEventWithNodes } from '@iota/wallet/out/types'
import { getVotingEvents } from '../actions'
import { IProposal } from '../interfaces'
import { createProposalFromEvent } from './createProposalFromEvent'

export async function createProposals(): Promise<IProposal[]> {
    const events: ParticipationEventWithNodes[] = Object.values(await getVotingEvents())
    const proposals: IProposal[] = await Promise.all(events?.map(async (event) => createProposalFromEvent(event)))
    return proposals
}
