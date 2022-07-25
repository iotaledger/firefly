import { get } from 'svelte/store'

import { addError } from '@core/error'
import { DashboardRoute, dashboardRouter } from '@core/router'

import { resetDeepLink } from '../actions'
import { DeepLinkContext } from '../enums'
import { isDeepLinkRequestActive } from '../stores'
import { handleDeepLinkWalletContext } from './wallet/handleDeepLinkWalletContext'

/**
 * Parses an IOTA deep link, i.e. a URL that begins with the app protocol i.e "firefly://".
 * @method parseDeepLinkRequest
 * @param {string} input The URL that was opened by the user.
 * @returns {void}
 */
export function handleDeepLink(input: string): void {
    isDeepLinkRequestActive.set(true)
    if (!input || typeof input !== 'string') {
        resetDeepLink()
        return
    }

    try {
        const url = new URL(input)
        if (url.protocol === `${process.env.APP_PROTOCOL}:`) {
            switch (url.hostname) {
                case DeepLinkContext.Wallet:
                    get(dashboardRouter).goTo(DashboardRoute.Wallet)
                    handleDeepLinkWalletContext(url)
                    break
                default:
                    addError({
                        time: Date.now(),
                        type: 'deepLink',
                        message: `Unrecognized context '${url.host}'`,
                    })
            }
        } else {
            resetDeepLink()
            addError({
                time: Date.now(),
                type: 'deepLink',
                message: `Error handling deep link. Does not start with ${process.env.APP_PROTOCOL}://`,
            })
        }
    } catch (err) {
        addError({ time: Date.now(), type: 'deepLink', message: `Error handling deep link. ${err.message}` })
    } finally {
        resetDeepLink()
    }
}
