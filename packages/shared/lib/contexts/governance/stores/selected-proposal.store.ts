import { IProposal } from '@contexts/governance/interfaces'
import { writable } from 'svelte/store'

export const selectedProposal = writable<IProposal>(null)
