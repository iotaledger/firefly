import { openPopup, PopupId } from '@auxiliary/popup'
import { addError } from '@core/error/stores'
import { localize } from '@core/i18n'

import { URL_CLEANUP_REGEX } from '../../constants'
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
    const pathnameParts = url.pathname.replace(URL_CLEANUP_REGEX, '').split('/')
    try {
        if (pathnameParts.length === 0 || !pathnameParts[0]) {
            throw new Error('No operation specified in the URL')
        }
        switch (pathnameParts[0]) {
            case WalletOperation.SendForm:
                handleDeepLinkSendFormOperation(url.searchParams)
                break
            case WalletOperation.SendConfirmation:
                handleDeepLinkSendConfirmationOperation(url.searchParams)
                break
            default: {
                throw new Error(
                    localize('notifications.deepLinkingRequest.wallet.unrecognizedOperation', {
                        values: { operation: pathnameParts[0] },
                    })
                )
            }
        }
    } catch (err) {
        openPopup({
            id: PopupId.DeepLinkError,
            props: { error: err, url },
        })
        addError({ time: Date.now(), type: 'deepLink', message: `Error handling deep link. ${err.message}` })
    }
}
