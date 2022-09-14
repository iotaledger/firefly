import { Writable } from 'svelte/store'

import { IProfileManager } from '@core/profile-manager'

export interface ILedgerStatusPollingConfiguration {
    pollInterval?: number
    profileManager?: Writable<IProfileManager>
}
