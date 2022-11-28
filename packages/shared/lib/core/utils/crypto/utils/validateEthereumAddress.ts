import { get } from 'svelte/store'

import { Keccak } from 'sha3'

import { networkHrp } from '@core/network/stores'

import { KECCAK_HASH_SIZE } from '../constants'
import { validateBech32Address } from './validateBech32Address'
import { Layer1RecipientError } from '@core/layer-2/errors'
import { InvalidAddressError } from '@auxiliary/deep-link'
import { localize } from '@core/i18n'

export function validateEthereumAddress(address: string): void {
    throwIfBech32Address(address)

    // Check if it has the basic requirements of an address
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        throw new InvalidAddressError()
        // Check if it's all small caps or all large caps
    } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
        return
    } else {
        // Otherwise check EIP-55 checksum
        validateEthereumAddressChecksum(address)
    }
}

// Check if EIP-55 mixed-case checksum address encoding is followed (https://eips.ethereum.org/EIPS/eip-55)
function validateEthereumAddressChecksum(address: string): void {
    address = address.replace('0x', '')
    const keccak256 = new Keccak(KECCAK_HASH_SIZE)
    const addressHash = keccak256.update(address.toLowerCase()).digest('hex')
    for (let i = 0; i < address.length; i++) {
        // The nth letter should be uppercase if the nth digit of casemap is 1
        if (
            (parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) ||
            (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])
        ) {
            throw new InvalidAddressError()
        }
    }
}

function throwIfBech32Address(address: string): void {
    try {
        validateBech32Address(get(networkHrp), address)
        throw new Layer1RecipientError()
    } catch (err) {
        if (err.message === localize('error.layer2.layer1Recipient')) {
            throw err
        }
    }
}
