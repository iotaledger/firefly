import { InclusionState } from '@iota/wallet/out/types'
import { writable } from 'svelte/store'

// TODO: check if account ID has to be included?
export const votingPowerTransactionState = writable<InclusionState>(null)
