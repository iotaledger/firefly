import { IProposal } from '@contexts/governance/interfaces'
import { writable, Readable, derived } from 'svelte/store'
import { registeredProposalsForSelectedWallet } from './registered-proposals.store'

export const selectedProposalId = writable<string>(null)

export const selectedProposal: Readable<IProposal> = derived(
    [selectedProposalId, registeredProposalsForSelectedWallet],
    ([$selectedProposalId, $registeredProposalsForSelectedWallet]) =>
        $registeredProposalsForSelectedWallet[$selectedProposalId]
)
