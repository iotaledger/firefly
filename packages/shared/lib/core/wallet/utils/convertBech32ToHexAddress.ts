import { networkHrp } from '@core/network'
import { Bech32Helper } from '@core/utils'
import { Converter } from '@core/utils'
import { get } from 'svelte/store'

export function convertBech32ToHexAddress(bech32: string): string {
    return bech32
        ? '0x' + Converter.bytesToHex(Bech32Helper.fromBech32(bech32, get(networkHrp)).addressBytes)
        : undefined
}
