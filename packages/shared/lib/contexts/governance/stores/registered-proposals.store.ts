import { selectedAccountIndex } from '@core/account/stores'
import { derived, Readable, writable } from 'svelte/store'
import { proposalStates } from '../stores'
import { IProposalMetadata, IRegisteredProposals, IProposal } from '../interfaces'

export const registeredProposals = writable<{ [accountId: number]: IRegisteredProposals }>({})

export const registeredProposalsForSelectedAccount: Readable<{ [proposalId: string]: IProposal }> = derived(
    [selectedAccountIndex, registeredProposals, proposalStates],
    ([$selectedAccountIndex, $registeredProposals, $proposalStates]) => {
        if ($selectedAccountIndex >= 0) {
            const registeredProposalMetadatas = $registeredProposals[$selectedAccountIndex] ?? {}

            const proposals: { [proposalId: string]: IProposal } = {}
            for (const key of Object.keys(registeredProposalMetadatas)) {
                const proposalState = $proposalStates[key] ?? { state: undefined }
                proposals[key] = { ...registeredProposalMetadatas[key], ...proposalState }
            }

            return proposals ?? {}
        } else {
            return {}
        }
    }
)

export function addProposalToRegisteredProposals(proposal: IProposalMetadata, accountId: number): void {
    registeredProposals.update((proposals) => {
        if (!proposals[accountId]) {
            proposals[accountId] = {}
        }

        proposals[accountId][proposal.id] = proposal
        return proposals
    })
}

export function removePersistedProposal(proposalId: string, accountId: number): void {
    registeredProposals.update((proposals) => {
        delete proposals[accountId][proposalId]
        return proposals
    })
}

export function resetRegisteredProposals(): void {
    registeredProposals.set({})
}
