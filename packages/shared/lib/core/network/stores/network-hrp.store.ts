import { activeProfile } from '@core/profile'
import { derived } from 'svelte/store'
import { NETWORK_INFO_MAP } from '../constants'
import { nodeInfo } from './node-info.store'

export const networkHrp = derived([nodeInfo, activeProfile], ([$nodeInfo, $activeProfile]) => {
    if ($nodeInfo) {
        return (
            $nodeInfo?.protocol?.bech32Hrp ??
            NETWORK_INFO_MAP?.[$activeProfile?.networkProtocol]?.[$activeProfile?.networkType]?.bech32Hrp ??
            ''
        )
    } else {
        return ''
    }
})
