import { DeepLinkParameters } from 'shared/lib/typings/deepLinking/deepLinking'
import { addError } from 'shared/lib/errors'
import { writable } from 'svelte/store'
import { parseWalletRequest } from './contextHandlers/walletContextHandler'

/**
 * Indicates that a deep link request is active
 */
export const deepLinkRequestActive = writable<boolean>(false)

/**
 * Parse an IOTA deep link i.e. a link that begins with the scheme iota://
 *
 * @method parseDeepLink
 *
 * @param {string} addressPrefix First four characters of address
 * @param {string} input The link that was opened
 */
export const parseDeepLink = (addressPrefix: string, input: string): void | DeepLinkParameters => {
    if (!input || typeof input !== 'string') {
        return
    }

    try {
        const url = new URL(input)

        if (url.protocol === 'iota:') {
            if (url.hostname === 'wallet') {
                return parseWalletRequest(url, addressPrefix)
            } else {
                return addError({ time: Date.now(), type: 'deepLink', message: `Unrecognized context '${url.host}'` })
            }
        } else {
            return addError({
                time: Date.now(),
                type: 'deepLink',
                message: 'Error handling deep link. Does not start with iota://',
            })
        }
    } catch (err) {
        return addError({ time: Date.now(), type: 'deepLink', message: `Error handling deep link. ${err.message}` })
    }
}
