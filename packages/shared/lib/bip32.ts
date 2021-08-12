import { get } from 'svelte/store'

import { showAppNotification } from './notifications'
import { selectedAccountId, wallet } from './wallet'
import type { Address, Bip32, Bip32Path } from './typings/address'

export const MIN_BIP32_INDEX = 0
export const MAX_BIP32_INDEX = 2147483647

export const constructBip32 = (changeIndex: number = 0, useInternal: boolean = false): Bip32 => {
    const _addressIndex = (addresses: Address[]) => {
        return addresses
            // only get addresses with no outputs that match the useInternal
            .filter((a) => Object.keys(a.outputs).length === 0 && a.internal === useInternal)
            // get first lowest address by keyIndex
            .reduce((a1, a2) => a1.keyIndex <= a2.keyIndex ? a1 : a2)
            .keyIndex
    }

    const accounts = get(get(wallet).accounts)
    const accountId = get(selectedAccountId)
    const account = accounts.filter((wa) => wa.id === accountId)[0]

    return {
        // BIP number indicating the wallet structure
        purpose: 44,

        // IOTA's number on the coin type list (maintained by Satoshi Labs - SLIP-0044)
        coinType: 4218,

        accountIndex: account?.index,
        addressIndex: _addressIndex(account?.addresses),

        changeIndex,

    }
}

export const composeBip32Path = (useHexadecimal: boolean = false, data: Bip32 = null): Bip32Path => {
    if(!data) data = constructBip32()

    data = validateBip32(data) as Bip32
    if(!data) {
        showAppNotification({
            /**
             * NOTE: Normally this would be an error, but since the displayBip32Path setting shouldn't
             * interfere with the main functionality (if it fails) then it makes more since to show a warning.
             */
            type: 'warning',
            message: 'Unable to compose BIP 32 path.'
        })

        return ''
    }

    return useHexadecimal ? toHexPath(data) : toPath(data)
}

const validateBip32 = (bip32: Bip32): Bip32 | null => {
    if(!bip32) return null

    const props = ['accountIndex', 'changeIndex', 'addressIndex']
    const isMissingIndexes = props.map(p => p in bip32).filter(b => b).length < props.length

    return isMissingIndexes ? null : bip32
}

const toHexPath = (data: Bip32): Bip32Path => {
    const _converted = {} as Bip32

    Object.keys(data).forEach((k) => {
        _converted[k] = data[k].toString(16)
    })

    return toPath(_converted)
}

const toPath = (data: Bip32): Bip32Path => {
    const {
        purpose,
        coinType,
        accountIndex,
        changeIndex,
        addressIndex
    } = data

    return `${purpose}'/${coinType}'/${accountIndex}'/${changeIndex}'/${addressIndex}'`
}
