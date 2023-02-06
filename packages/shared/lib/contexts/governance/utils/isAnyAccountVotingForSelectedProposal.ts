import { activeAccounts } from '@core/profile'
import { get } from 'svelte/store'
import { isVotingForSelectedProposal } from './isVotingForSelectedProposal'

export function isAnyAccountVotingForSelectedProposal(): boolean {
    const accountIndexes = get(activeAccounts).map((account) => account.index)
    const accountIsVoting = accountIndexes.map(isVotingForSelectedProposal)
    return accountIsVoting.some((bool) => bool === true)
}
