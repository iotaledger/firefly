import { selectedAccountIndex } from '@core/account/stores'
import { networkStatus } from '@core/network/stores/network-status.store'
import { derived, Readable, writable } from 'svelte/store'
import { IProposal, IProposalMetadata, IRegisteredProposals } from '../interfaces'
import { getProposalStatusForMilestone } from '../utils'

export const registeredProposals = writable<{ [accountId: number]: IRegisteredProposals }>({})

export const registeredProposalsForSelectedAccount: Readable<{ [proposalId: string]: IProposal }> = derived(
    [selectedAccountIndex, registeredProposals, networkStatus],
    ([$selectedAccountIndex, $registeredProposals, $networkStatus]) => {
        if ($networkStatus && $selectedAccountIndex >= 0) {
            const proposalsForSelectedAccount = $registeredProposals[$selectedAccountIndex] ?? {}
            const proposals: { [proposalId: string]: IProposal } = {}
            for (const key of Object.keys(proposalsForSelectedAccount)) {
                const status = getProposalStatusForMilestone(
                    $networkStatus.currentMilestone,
                    proposalsForSelectedAccount[key]?.milestones
                )
                proposals[key] = { ...proposalsForSelectedAccount[key], status }
            }

            return proposals
        } else {
            return {}
        }
    }
)

export function addOrUpdateProposalToRegisteredProposals(proposal: IProposalMetadata, accountId: number): void {
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
