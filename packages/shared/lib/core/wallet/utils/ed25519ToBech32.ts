import { networkHrp } from '@core/network'
import { Bech32Helper } from '@lib/bech32Helper'
import { Converter } from '@lib/converter'
import { get } from 'svelte/store'

export function ed25519ToBech32(ed25519: string): string {
    return ed25519 ? Bech32Helper.toBech32(0, Converter.hexToBytes(ed25519.substring(2)), get(networkHrp)) : undefined
}
