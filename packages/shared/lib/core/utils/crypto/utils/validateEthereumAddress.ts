import { get } from 'svelte/store'

import { Keccak } from 'sha3'

import { localize } from '@core/i18n'
import { networkHrp } from '@core/network/stores'

import { ETHEREUM_ADDRESS_HASH_SIZE } from '../constants'
import { validateBech32Address } from './validateBech32Address'

export function validateEthereumAddress(address: string): string {
    // TODO: currently, validateBech32Address throws an error string if an invalid address is provided.
    // If the address is a valid bech32 address, null is returned
    // This evaluates to false, which accounts for the weird logic
    // Issue to fix this: https://github.com/iotaledger/firefly/issues/5240
    const validBech32Address = !validateBech32Address(get(networkHrp), address)
    if (validBech32Address) {
        return localize('error.layer2.layer1Recipient')
    }
    // Check if it has the basic requirements of an address
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        return localize('error.send.invalidAddress')
        // Check if it's all small caps or all large caps
    } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
        return null
    } else {
        // Otherwise check EIP-55 checksum
        return isChecksumAddress(address)
    }
}

// Check if EIP-55 mixed-case checksum address encoding is followed (https://eips.ethereum.org/EIPS/eip-55)
function isChecksumAddress(address: string): string {
    address = address.replace('0x', '')
    const keccak256 = new Keccak(ETHEREUM_ADDRESS_HASH_SIZE)
    const addressHash = keccak256.update(address.toLowerCase()).digest('hex')
    for (let i = 0; i < address.length; i++) {
        // The nth letter should be uppercase if the nth digit of casemap is 1
        if (
            (parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) ||
            (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])
        ) {
            return localize('error.send.invalidAddress')
        }
    }
    return null
}
