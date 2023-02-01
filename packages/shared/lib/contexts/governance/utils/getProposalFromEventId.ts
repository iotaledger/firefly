import { IAccountState } from '@core/account'
import { get } from 'svelte/store'
import { getVotingEvents } from '../actions'
import { IProposal } from '../interfaces'
import { proposalStates } from '../stores'
import { createProposalFromEvent } from './createProposalFromEvent'

export async function getProposalFromEventId(eventId: string, account: IAccountState): Promise<IProposal> {
    const events = await getVotingEvents(account)
    const event = events[eventId]
    /**
     * NOTE: If createProposalFromEvent function starts having stateful behavior (store, persist value) then we should refactor this function to not use it.
     */
    if (event === undefined) {
        throw new Error(`Event with id ${eventId} not found`)
    } else {
        const proposalMetadata = createProposalFromEvent(event)
        const proposalState = get(proposalStates)[eventId] ?? { state: undefined }
        return { ...proposalMetadata, ...proposalState.state }
    }
}
