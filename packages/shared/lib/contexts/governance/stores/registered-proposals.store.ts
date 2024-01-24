import { networkStatus } from '@core/network/stores/network-status.store'
import { selectedWalletId } from '@core/wallet/stores/selected-wallet-id.store'
import { derived, Readable, writable } from 'svelte/store'
import { IProposal, IProposalMetadata, IRegisteredProposals } from '../interfaces'
import { getProposalStatusForSlot } from '../utils'

export const registeredProposals = writable<{ [walletId: string]: IRegisteredProposals }>({})

// TODO(2.0) Rename this
export const registeredProposalsForSelectedWallet: Readable<{ [proposalId: string]: IProposal }> = derived(
    [selectedWalletId, registeredProposals, networkStatus],
    ([$selectedWalletId, $registeredProposals, $networkStatus]) => {
        if ($networkStatus && selectedWalletId) {
            const proposalsForSelectedWallet = $registeredProposals[$selectedWalletId] ?? {}
            const proposals: { [proposalId: string]: IProposal } = {}
            for (const key of Object.keys(proposalsForSelectedWallet)) {
                const status = getProposalStatusForSlot(
                    $networkStatus.currentSlot,
                    proposalsForSelectedWallet[key]?.slots
                )
                proposals[key] = { ...proposalsForSelectedWallet[key], status }
            }

            return proposals
        } else {
            return {}
        }
    }
)

export function addOrUpdateProposalToRegisteredProposals(proposal: IProposalMetadata, walletId: string): void {
    registeredProposals.update((proposals) => {
        if (!proposals[walletId]) {
            proposals[walletId] = {}
        }

        proposals[walletId][proposal.id] = proposal
        return proposals
    })
}

export function removePersistedProposal(proposalId: string, walletId: string): void {
    registeredProposals.update((proposals) => {
        delete proposals[walletId][proposalId]
        return proposals
    })
}

export function resetRegisteredProposals(): void {
    registeredProposals.set({})
}
