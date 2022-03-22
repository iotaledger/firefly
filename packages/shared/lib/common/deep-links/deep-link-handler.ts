import { addError } from '../../errors'

import { parseWalletDeepLinkRequest } from '@common/deep-links/wallet-context-handler'
import type { DeepLinkRequest } from '@common/deep-links/types'

/**
 * Parses an IOTA deep link, i.e. a URL that begins with the scheme "iota://".
 *
 * @method parseDeepLinkRequest
 *
 * @param {string} expectedAddressPrefix The expected human-readable part of a Bech32 address.
 * @param {string} input The URL that was opened by the user.
 *
 * @returns {void | DeepLinkRequest} The formatted content of a deep link request.
 */
export const parseDeepLinkRequest = (expectedAddressPrefix: string, input: string): void | DeepLinkRequest => {
    if (!input || typeof input !== 'string') {
        return
    }

    try {
        const url = new URL(input)

        if (url.protocol === 'iota:') {
            if (url.hostname === 'wallet') {
                return parseWalletDeepLinkRequest(url, expectedAddressPrefix)
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
