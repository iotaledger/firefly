import { activeProfile } from '@core/profile'
import { get } from 'svelte/store'
import { isVotingForSelectedProposal } from './isVotingForSelectedProposal'

export async function isAnyAccountVotingForSelectedProposal(): Promise<boolean> {
    const accountIndexes = Object.values(get(activeProfile)?.accountMetadata).map(
        (accountMetadata) => accountMetadata.index
    )
    const isVotingPromises = accountIndexes.map(isVotingForSelectedProposal)
    const results = await Promise.all(isVotingPromises)
    return results.some((bool) => bool === true)
}
