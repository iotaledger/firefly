import { writable } from 'svelte/store'

export const isPollingLedgerDeviceStatus = writable<boolean>(false)
