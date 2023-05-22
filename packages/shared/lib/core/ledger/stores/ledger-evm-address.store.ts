import { writable } from 'svelte/store'
import { IEvmSignature } from '@core/app/interfaces'

export const ledgerEvmSignature = writable<IEvmSignature>(null)
