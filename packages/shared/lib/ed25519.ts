import { Bech32 } from '@lib/bech32'
import { toHexString } from '@lib/utils'

/**
 * Converts a Bech32 address to an Ed25519 address.
 */
export function convertBech32AddressToEd25519Address(bech32Address: string, includeTypeByte: boolean = false): string {
    if (!bech32Address) return ''

    return toHexString(Array.from(Bech32.decode(bech32Address).data).slice(includeTypeByte ? 0 : 1))
}
