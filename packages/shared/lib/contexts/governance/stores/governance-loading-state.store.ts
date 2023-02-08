import { writable } from 'svelte/store'
import { GovernanceLoadingState } from '../enums'

export const governanceLoadingState = writable<GovernanceLoadingState>(GovernanceLoadingState.NothingLoaded)
