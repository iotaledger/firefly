import validUrl from 'valid-url'

import { PINCODE_LENGTH } from './constants'

export function isValidPincode(pincode: string): boolean {
    const REGEX = new RegExp(`^\\d{${PINCODE_LENGTH}}$`)
    return REGEX.test(pincode)
}

export function isValidUrl(url: string): boolean {
    return validUrl.isWebUri(url)
}

export function isValidHttpsUrl(url: string): boolean {
    return validUrl.isHttpsUri(url)
}
