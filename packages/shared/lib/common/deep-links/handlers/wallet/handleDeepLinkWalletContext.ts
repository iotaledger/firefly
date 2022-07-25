import { addError } from '@core/error'

import { WalletOperation } from '../../enums'
import { handleDeepLinkSendOperation } from './operations/handleDeepLinkSendOperation'

/**
 * Parses a deep link within the wallet context.
 *
 * @method parseWalletDeepLinkRequest
 *
 * @param {URL} url The URL that was opened by the user.
 * @param {string} expectedAddressPrefix The expected human-readable part of a Bech32 address.
 *
 * @return {void | DeepLinkRequest} The formatted content of a deep link request within the wallet context.
 */
export function handleDeepLinkWalletContext(url: URL): void {
    // Remove any leading and trailing slashes
    const pathnameParts = url.pathname.replace(/^\/+|\/+$/g, '').split('/')

    if (pathnameParts.length === 0) {
        return addError({ time: Date.now(), type: 'deepLink', message: 'No operation specified in the url' })
    }

    switch (pathnameParts[0]) {
        case WalletOperation.SendForm:
            handleDeepLinkSendOperation(url.searchParams)
            break
        case WalletOperation.SendConfirmation:
            handleDeepLinkSendOperation(url.searchParams, true)
            break
        default:
            return addError({
                time: Date.now(),
                type: 'deepLink',
                message: `Unrecognized wallet operation '${pathnameParts[0]}'`,
            })
    }
}
