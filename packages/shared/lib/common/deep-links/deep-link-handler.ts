import { addError } from '../../errors'

import { DeepLinkRequest } from './types'
import { parseWalletDeepLinkRequest } from './wallet-context-handler'

export function parseDeepLinkRequest(expectedAddressPrefix: string, input: string): void | DeepLinkRequest {
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
