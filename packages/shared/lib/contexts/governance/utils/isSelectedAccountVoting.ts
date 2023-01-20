import { get } from 'svelte/store'
import { participationOverview } from '../stores'
import { isVotingForProposal } from '@contexts/governance/utils/isVotingForProposal'

export async function isSelectedAccountVoting(): Promise<boolean> {
    const { participations } = get(participationOverview)
    for (const proposalId in participations) {
        const isVoting = await isVotingForProposal(proposalId)
        if (isVoting) {
            return true
        }
    }
    return false
}
