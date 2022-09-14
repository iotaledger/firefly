import { Writable } from 'svelte/store'

import { IProfileManager } from '@core/profile-manager'

export interface ILedgerNanoStatusPollingConfiguration {
    pollInterval?: number
    profileManager?: Writable<IProfileManager>
}
