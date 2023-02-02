import { activeAccounts } from '@core/profile'
import { get } from 'svelte/store'
import { isVotingForSelectedProposal } from './isVotingForSelectedProposal'

export async function isAnyAccountVotingForSelectedProposal(): Promise<boolean> {
    const accountIndexes = get(activeAccounts).map((account) => account.index)
    const isVotingPromises = accountIndexes.map(isVotingForSelectedProposal)
    const results = await Promise.all(isVotingPromises)
    return results.some((bool) => bool === true)
}
