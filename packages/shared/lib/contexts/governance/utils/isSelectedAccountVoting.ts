import { get } from 'svelte/store'
import { participationOverviewForSelectedAccount } from '../stores'
import { isVotingForProposal } from '@contexts/governance/utils/isVotingForProposal'

export function isSelectedAccountVoting(): boolean {
    const overview = get(participationOverviewForSelectedAccount)
    const participations = overview?.participations ?? []
    for (const proposalId in participations) {
        const isVoting = isVotingForProposal(proposalId)
        if (isVoting) {
            return true
        }
    }
    return false
}
