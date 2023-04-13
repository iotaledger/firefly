import { get } from 'svelte/store'

import { networkHrp } from '@core/profile/stores'
import { Converter } from '@core/utils/convert'
import { Bech32Helper } from '@core/utils/crypto'

export function convertBech32ToHexAddress(bech32: string): string {
    return bech32 ? Converter.bytesToHex(Bech32Helper.fromBech32(bech32, get(networkHrp)).addressBytes) : undefined
}
