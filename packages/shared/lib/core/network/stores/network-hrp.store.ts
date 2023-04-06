import { activeProfile } from '@core/profile'
import { derived } from 'svelte/store'
import { nodeInfo } from './node-info.store'

export const networkHrp = derived([nodeInfo, activeProfile], ([$nodeInfo, $activeProfile]) => {
    if ($nodeInfo) {
        return $nodeInfo?.protocol?.bech32Hrp ?? $activeProfile?.network?.protocol?.bech32Hrp ?? ''
    } else {
        return $activeProfile?.network?.protocol?.bech32Hrp ?? ''
    }
})
