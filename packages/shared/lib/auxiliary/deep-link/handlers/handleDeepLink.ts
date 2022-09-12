import { get } from 'svelte/store'

import { addError } from '@core/error'
import { DashboardRoute, dashboardRouter } from '@core/router'

import { resetDeepLink } from '../actions'
import { DeepLinkContext } from '../enums'
import { isDeepLinkRequestActive } from '../stores'
import { handleDeepLinkWalletContext } from './wallet/handleDeepLinkWalletContext'
import { closePopup, openPopup } from '@lib/popup'
import { visibleActiveAccounts } from '@core/profile/stores/active-accounts.store'

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
        if (url.protocol !== `${process.env.APP_PROTOCOL}:`) {
            throw new Error(`Does not start with ${process.env.APP_PROTOCOL}://`)
        }

        if (get(visibleActiveAccounts).length > 1) {
            openPopup({
                type: 'accountSwitcher',
                overflow: true,
                props: {
                    onConfirm: () => {
                        closePopup()
                        handleDeepLinkForHostname(url)
                    },
                },
            })
        } else {
            handleDeepLinkForHostname(url)
        }
    } catch (err) {
        addError({ time: Date.now(), type: 'deepLink', message: `Error handling deep link. ${err.message}` })
    } finally {
        resetDeepLink()
    }
}

function handleDeepLinkForHostname(url: URL): void {
    switch (url.hostname) {
        case DeepLinkContext.Wallet:
            get(dashboardRouter).goTo(DashboardRoute.Wallet)
            handleDeepLinkWalletContext(url)
            break
        default:
            throw new Error(`Unrecognized context '${url.host}'`)
    }
}
