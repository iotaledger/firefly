import { localize } from '@core/i18n'
import { Bech32 } from '@lib/bech32'

export function validateBech32Address(prefix: string, addr: string): string {
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
