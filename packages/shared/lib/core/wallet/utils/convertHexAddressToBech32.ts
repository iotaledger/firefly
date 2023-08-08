import { getNetworkHrp } from '@core/profile'
import { Converter } from '@core/utils/convert'
import { Bech32Helper } from '@core/utils/crypto'

// TODO-sdk replace in favour of utils
export function convertHexAddressToBech32(addressType: number, hexAddress: string): string | undefined {
    return hexAddress
        ? Bech32Helper.toBech32(addressType, Converter.hexToBytes(hexAddress), getNetworkHrp())
        : undefined
}
