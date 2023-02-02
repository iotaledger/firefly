import { activeAccounts } from '@core/profile'
import { get } from 'svelte/store'
import { isVotingForSelectedProposal } from './isVotingForSelectedProposal'

export async function isAnyAccountVotingForSelectedProposal(): Promise<boolean> {
    const isVotingPromises = get(activeAccounts).map(isVotingForSelectedProposal)
    const results = await Promise.all(isVotingPromises)
    return results.some((bool) => bool === true)
}
