import { addError } from '@core/error'
import { localize } from '@core/i18n'
import { openPopup } from '@lib/popup'

import { WalletOperation } from '../../enums'
import { handleDeepLinkSendConfirmationOperation, handleDeepLinkSendFormOperation } from './operations'

/**
 * Parses a deep link within the wallet context.
 *
 * @method parseWalletDeepLinkRequest
 *
 * @param {URL} url The URL that was opened by the user.
 *
 * @return {void} The formatted content of a deep link request within the wallet context.
 */
export function handleDeepLinkWalletContext(url: URL): void {
    // Remove any leading and trailing slashes
    const pathnameParts = url.pathname.replace(/^\/+|\/+$/g, '').split('/')

    if (pathnameParts.length === 0) {
        return addError({ time: Date.now(), type: 'deepLink', message: 'No operation specified in the url' })
    }
    try {
        switch (pathnameParts[0]) {
            case WalletOperation.SendForm:
                handleDeepLinkSendFormOperation(url.searchParams)
                break
            case WalletOperation.SendConfirmation:
                handleDeepLinkSendConfirmationOperation(url.searchParams)
                break
            default: {
                const message = localize('notifications.deepLinkingRequest.wallet.unrecognizedOperation', {
                    values: { operation: pathnameParts[0] },
                })
                console.error(message)
                return addError({
                    time: Date.now(),
                    type: 'deepLink',
                    message,
                })
            }
        }
    } catch (err) {
        openPopup({
            type: 'deepLinkError',
            props: { error: err, url },
        })
    }
}
