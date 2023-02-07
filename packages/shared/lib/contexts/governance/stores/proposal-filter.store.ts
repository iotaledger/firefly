import { writable, Writable } from 'svelte/store'
import { DEFAULT_PROPOSAL_FILTER } from '../constants'
import { IProposalFilter } from '../interfaces'

export const proposalFilter: Writable<IProposalFilter> = writable(DEFAULT_PROPOSAL_FILTER)
