import { Keccak } from 'sha3'
import { KECCAK_HASH_SIZE } from '../constants'

// Note: this file does something very similar to validateEthereumAddress but it does not throw UI errors if the address is invalid

export function isValidEthereumAddress(address: string): boolean {
    return /^(0x)?[0-9a-f]{40}$/i.test(address) && isValidEthereumAddressChecksum(address)
}

// Check if EIP-55 mixed-case checksum address encoding is followed (https://eips.ethereum.org/EIPS/eip-55)
function isValidEthereumAddressChecksum(address: string): boolean {
    address = address.replace('0x', '')
    const keccak256 = new Keccak(KECCAK_HASH_SIZE)
    const addressHash = keccak256.update(address.toLowerCase()).digest('hex')
    for (let i = 0; i < address.length; i++) {
        // The nth letter should be uppercase if the nth digit of casemap is 1
        if (
            (parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) ||
            (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])
        ) {
            return false
        }
    }
    return true
}
