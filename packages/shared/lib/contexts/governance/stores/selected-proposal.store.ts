import { writable } from 'svelte/store'
import { IProposal } from '@contexts/governance/interfaces'

export const selectedProposal = writable<IProposal>(null)
