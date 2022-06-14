import { NETWORK, nodeInfo } from '@core/network'
import { Converter } from '@lib/converter'
import { Bech32Helper } from '@lib/bech32Helper'
import { get } from 'svelte/store'
import { activeProfile } from '@core/profile'

export function ed25519ToBech32(ed25519: string): string {
    const hrp =
        get(nodeInfo)?.protocol?.bech32HRP ??
        NETWORK?.[get(activeProfile)?.networkProtocol]?.[get(activeProfile)?.networkType]?.bech32Hrp ??
        ''

    return ed25519 ? Bech32Helper.toBech32(0, Converter.hexToBytes(ed25519.substring(2)), hrp) : undefined
}
