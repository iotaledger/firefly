import { get } from 'svelte/store'

import { Keccak } from 'sha3'

import { localize } from '@core/i18n'
import { networkHrp } from '@core/network/stores'

import { ETHEREUM_ADDRESS_HASH_SIZE } from '../constants'
import { validateBech32Address } from './validateBech32Address'

export function validateEthereumAddress(address: string): boolean {
    validateBech32Address(get(networkHrp), address)

    // Check if it has the basic requirements of an address
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        throw new Error(localize('error.send.invalidAddress'))
        // Check if it's all small caps or all large caps
    } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
        return true
    } else {
        // Otherwise check EIP-55 checksum
        return validateEthereumAddressChecksum(address)
    }
}

// Check if EIP-55 mixed-case checksum address encoding is followed (https://eips.ethereum.org/EIPS/eip-55)
function validateEthereumAddressChecksum(address: string): boolean {
    address = address.replace('0x', '')
    const keccak256 = new Keccak(ETHEREUM_ADDRESS_HASH_SIZE)
    const addressHash = keccak256.update(address.toLowerCase()).digest('hex')
    for (let i = 0; i < address.length; i++) {
        // The nth letter should be uppercase if the nth digit of casemap is 1
        if (
            (parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) ||
            (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])
        ) {
            throw new Error(localize('error.send.invalidAddress'))
        }
    }

    return true
}
