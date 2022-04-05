import { Address } from '@lib/typings/address'
import { Bech32 } from '@lib/bech32'
import { toHexString } from '@lib/utils'
import { WalletAccount } from '@lib/typings/wallet'

/**
 * Converts the bytes of a Bech32 address into an Ed215519 address string.
 */
export function toEd25519Address(bech32Address: Address): string {
    if (!bech32Address) return ''

    return toHexString(Array.from(Bech32.decode(bech32Address.address).data))
}

/**
 * Creates a list of Ed25519 addresses from the Bech32 addresses that belong
 * to an account.
 */
export function getEd25519AddressesOfAccount(account: WalletAccount): string[] {
    if (!account) return []

    return account.addresses.map((bech32Address) => toEd25519Address(bech32Address))
}
