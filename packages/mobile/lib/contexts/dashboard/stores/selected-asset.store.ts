import { IAsset } from '@core/wallet'
import { writable } from 'svelte/store'

export const selectedAsset = writable<IAsset>(null)
