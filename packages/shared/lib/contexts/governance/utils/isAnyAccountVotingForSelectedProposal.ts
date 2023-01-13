import { activeProfile } from '@core/profile'
import { get } from 'svelte/store'
import { isVotingForSelectedProposal } from './isVotingForSelectedProposal'

export function isAnyAccountVotingForSelectedProposal(): boolean {
    const accountIndexes = Object.values(get(activeProfile)?.accountMetadata).map(
        (accountMetadata) => accountMetadata.index
    )
    return accountIndexes.some((accountIndex) => isVotingForSelectedProposal(accountIndex))
}
