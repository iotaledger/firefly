import { get } from 'svelte/store'

import { closePopup, openPopup } from '@auxiliary/popup/actions'
import { Platform } from '@core/app/classes'
import { handleError } from '@core/error/handlers'
import { visibleActiveAccounts } from '@core/profile/stores'
import { dashboardRouter } from '@core/router/routers'
import { DashboardRoute } from '@core/router/enums'

import { DeepLinkContext } from '../enums'

import { handleDeepLinkGovernanceContext } from './handlers/governance/handleDeepLinkGovernanceContext'
import { handleDeepLinkWalletContext } from './handlers/wallet/handleDeepLinkWalletContext'

/**
 * Parses an IOTA deep link, i.e. a URL that begins with the app protocol i.e "firefly://".
 * @method parseDeepLinkRequest
 * @param {string} input The URL that was opened by the user.
 * @returns {void}
 */
export function handleDeepLink(input: string): void {
    if (!input || typeof input !== 'string') {
        Platform.DeepLinkManager.clearDeepLinkRequest()
        return
    }

    try {
        const url = new URL(input)
        if (url.protocol !== `${process.env.APP_PROTOCOL}:`) {
            throw new Error(`Does not start with ${process.env.APP_PROTOCOL}://`)
        }

        if (get(visibleActiveAccounts).length > 1) {
            openPopup({
                id: 'accountSwitcher',
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
        Platform.DeepLinkManager.clearDeepLinkRequest()
    }
}

function handleDeepLinkForHostname(url: URL): void {
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
