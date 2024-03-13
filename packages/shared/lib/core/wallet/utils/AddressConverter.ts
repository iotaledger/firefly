import { Address, HexEncodedString } from '@iota/sdk/out/types'
import { getNetworkHrp } from '@core/profile'
import { api } from '@core/api'

export class AddressConverter {
    /**
     * Converts an address to its bech32 representation.
     *
     * @param address An address.
     * @param bech32Hrp The Bech32 HRP (human readable part) to use.
     * @returns The Bech32-encoded address string.
     */
    static addressToBech32(address: Address): string {
        const hrp = getNetworkHrp()
        return api.addressToBech32(address, hrp)
    }

    /**
     * Parse a Bech32 address from a string.
     *
     * @param bech32 A Bech32 address as string.
     * @returns A Bech32 address.
     */
    static parseBech32Address(bech32: string): HexEncodedString {
        return Address.parse(api.parseBech32Address(bech32)).toString()
    }
}
