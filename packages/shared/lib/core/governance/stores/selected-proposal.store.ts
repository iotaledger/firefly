import { writable } from 'svelte/store'
import { IProposal } from '@core/governance/interfaces'

export const selectedProposal = writable<IProposal>(null)
