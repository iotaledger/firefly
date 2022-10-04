import { networkHrp } from '@core/network'
import { Bech32Helper } from '@lib/bech32Helper'
import { Converter } from '@lib/converter'
import { get } from 'svelte/store'

export function convertHexAddressToBech32(addressType: number, hexAddress: string): string {
    return hexAddress
        ? Bech32Helper.toBech32(addressType, Converter.hexToBytes(hexAddress.substring(2)), get(networkHrp))
        : undefined
}
