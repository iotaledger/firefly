import { Writable } from 'svelte/store'

import { IProfileManager } from '@core/profile-manager'

// TODO(2.0) Fix this
export interface ILedgerNanoStatusPollingConfiguration {
    pollInterval?: number
    profileManager?: Writable<IProfileManager>
}
