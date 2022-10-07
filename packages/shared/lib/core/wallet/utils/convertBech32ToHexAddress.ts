import { networkHrp } from '@core/network'
import { Bech32Helper } from '@lib/bech32Helper'
import { Converter } from '@lib/converter'
import { get } from 'svelte/store'

export function convertBech32ToHexAddress(bech32: string): string {
    return bech32
        ? '0x' + Converter.bytesToHex(Bech32Helper.fromBech32(bech32, get(networkHrp)).addressBytes)
        : undefined
}
