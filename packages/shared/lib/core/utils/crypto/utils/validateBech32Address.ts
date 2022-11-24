import { localize } from '@core/i18n'
import { ADDRESS_TYPE_MAP } from '@core/wallet/constants'

import { convertBytesToHexString } from '../../convert'
import { Bech32 } from '../classes'

export function validateBech32Address(prefix: string, addr: string, addressType?: number): string {
    const addressTypeLetter = ADDRESS_TYPE_MAP[addressType] ?? ''
    if (!addr || !addr.startsWith(prefix)) {
        return localize('error.send.wrongAddressPrefix', {
            values: {
                prefix: prefix,
            },
        })
    }
    if (!new RegExp(`^${prefix}1[02-9ac-hj-np-z]{59}$`).test(addr)) {
        return localize('error.send.wrongAddressFormat')
    }

    if (addressTypeLetter && !new RegExp(`^${prefix}1${addressTypeLetter}[02-9ac-hj-np-z]{58}$`).test(addr)) {
        return localize('error.address.wrongAddressType')
    }

    let isValid = false
    try {
        const decoded = Bech32.decode(addr)
        isValid = decoded && decoded.humanReadablePart === prefix
    } catch (err) {
        console.error('error.crypto.cannotDecodeBech32')
    }

    if (!isValid) {
        return localize('error.send.invalidAddress')
    }
}

export function isValidBech32AddressAndPrefix(address: string, expectedAddressPrefix: string): boolean {
    return new RegExp(`^${expectedAddressPrefix}1[02-9ac-hj-np-z]{59}$`).test(address)
}

export function convertBech32AddressToEd25519Address(bech32Address: string, includeTypeByte: boolean = false): string {
    if (!bech32Address) return ''

    return convertBytesToHexString(Array.from(Bech32.decode(bech32Address).data).slice(includeTypeByte ? 0 : 1))
}
