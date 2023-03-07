import { get } from 'svelte/store'
import { allParticipationOverviews } from '../stores'
import { isVotingForProposal } from '@contexts/governance/utils/isVotingForProposal'

export function isAccountVoting(accountIndex: number): boolean {
    const overview = get(allParticipationOverviews)[accountIndex]
    const participations = overview?.participations ?? []

    for (const proposalId in participations) {
        const isVoting = isVotingForProposal(proposalId)
        if (isVoting) {
            return true
        }
    }
    return false
}
