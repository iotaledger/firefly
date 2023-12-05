import { Writable } from 'svelte/store'

// TODO(2.0) Fix this
export interface ILedgerNanoStatusPollingConfiguration {
    pollInterval?: number
    profileManager?: Writable<IProfileManager>
}
