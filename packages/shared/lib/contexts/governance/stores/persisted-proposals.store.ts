import { selectedAccountIndex } from '@core/account/stores'
import { activeProfileId } from '@core/profile'
import { derived, Readable, get } from 'svelte/store'
import { proposalStates } from '../stores'
import { IProposalMetadata, IPersistedProposals, IProposal } from '../interfaces'
import { persistent } from '@core/utils/store'

export const persistedProposals = persistent<IPersistedProposals>('persistedProposals', {})

export const registeredProposalsForSelectedAccount: Readable<{ [proposalId: string]: IProposal }> = derived(
    [activeProfileId, selectedAccountIndex, persistedProposals, proposalStates],
    ([$profileId, $selectedAccountIndex, $persistedProposals, $proposalStates]) => {
        if ($selectedAccountIndex) {
            const registeredProposalMetadatas = $persistedProposals[$profileId][$selectedAccountIndex]

            const proposals: { [proposalId: string]: IProposal } = {}
            for (const key of Object.keys(persistedProposals)) {
                const proposalState = $proposalStates[key] ?? { state: undefined }
                proposals[key] = { ...registeredProposalMetadatas[key], ...proposalState }
            }

            return proposals ?? {}
        } else {
            return {}
        }
    }
)

export function addProposalToPersistedProposals(proposal: IProposalMetadata, accountId: number): void {
    persistedProposals.update((proposals) => {
        if (!proposals[get(activeProfileId)]) {
            proposals[get(activeProfileId)] = {}
        }

        if (!proposals[get(activeProfileId)][accountId]) {
            proposals[get(activeProfileId)][accountId] = {}
        }

        proposals[get(activeProfileId)][accountId][proposal.id] = proposal
        return proposals
    })
}

export function removePersistedProposal(proposalId: string, accountId: number): void {
    persistedProposals.update((proposals) => {
        delete proposals[get(activeProfileId)][accountId][proposalId]
        return proposals
    })
}
