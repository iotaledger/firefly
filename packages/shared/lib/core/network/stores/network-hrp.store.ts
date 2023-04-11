import { activeProfile } from '@core/profile'
import { derived } from 'svelte/store'

export const networkHrp = derived([activeProfile], ([$activeProfile]) => $activeProfile?.network?.protocol?.bech32Hrp)
