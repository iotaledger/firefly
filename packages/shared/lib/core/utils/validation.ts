import validUrl from 'valid-url'

import { PIN_LENGTH } from './constants'

export function isValidPin(pin: string): boolean {
    const REGEX = new RegExp(`^\\d{${PIN_LENGTH}}$`)
    return REGEX.test(pin)
}

export function isValidUrl(url: string): boolean {
    return validUrl.isWebUri(url)
}

export function isValidHttpsUrl(url: string): boolean {
    return validUrl.isHttpsUri(url)
}
