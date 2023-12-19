import { get } from 'svelte/store'

import { closePopup, openPopup, PopupId } from '@auxiliary/popup'
import { visibleActiveWallets } from '@core/profile/stores'
import { dashboardRouter } from '@core/router/routers'
import { DashboardRoute } from '@core/router/enums'

import { resetDeepLink } from '../actions'
import { DeepLinkContext } from '../enums'
import { isDeepLinkRequestActive } from '../stores'

import { handleDeepLinkGovernanceContext } from './governance/handleDeepLinkGovernanceContext'
import { handleDeepLinkWalletContext } from './wallet/handleDeepLinkWalletContext'
import { handleError } from '@core/error/handlers'
import { convertChrysalisDeepLinkToStardust } from './chrysalisDeepLink'

/**
 * Parses an IOTA deep link, i.e. a URL that begins with the app protocol i.e "iota://".
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

        if (get(visibleActiveWallets).length > 1) {
            openPopup({
                id: PopupId.WalletSwitcher,
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
        handleError(err)
    } finally {
        resetDeepLink()
    }
}

function handleDeepLinkForHostname(url: URL): void {
    // Convert to a stardust deeplink if it's following the crysalis schema
    try {
        url = convertChrysalisDeepLinkToStardust(url, process.env.APP_PROTOCOL)
    } catch (_) {
        // We assume the URL is actually just not following chrysalis schema
    }

    switch (url.hostname) {
        case DeepLinkContext.Wallet:
            get(dashboardRouter).goTo(DashboardRoute.Wallet)
            handleDeepLinkWalletContext(url)
            break
        case DeepLinkContext.Governance:
            get(dashboardRouter).goTo(DashboardRoute.Governance)
            handleDeepLinkGovernanceContext(url)
            break
        default:
            throw new Error(`Unrecognized context '${url.host}'`)
    }
}
