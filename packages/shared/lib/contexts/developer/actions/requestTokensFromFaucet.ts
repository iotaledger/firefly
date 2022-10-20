import { selectedAccount } from '@core/account'
import { localize } from '@core/i18n'
import { FAUCET_URLS } from '@core/network'
import { activeProfile } from '@core/profile'
import { showAppNotification } from '@auxiliary/notification'
import { get } from 'svelte/store'

export async function requestTokensFromFaucet(): Promise<void> {
    const url = FAUCET_URLS?.[get(activeProfile)?.networkProtocol]?.[get(activeProfile)?.networkType]

    if (url) {
        const headers = new Headers()
        headers.append('Content-Type', 'application/json')

        const address = get(selectedAccount)?.depositAddress
        const body = JSON.stringify({ address })

        const requestInit = {
            method: 'POST',
            headers,
            body,
        }

        try {
            const response = await fetch(url, requestInit)
            if (response?.status === 202) {
                showAppNotification({
                    type: 'success',
                    message: localize('notifications.faucetRequest.success'),
                    alert: true,
                })
                return Promise.resolve()
            } else if (response?.status === 400) {
                return Promise.reject('Request already being processed for your address')
            } else {
                return Promise.reject('Request failed, please try again')
            }
        } catch (reason) {
            return Promise.reject(reason)
        }
    } else {
        return Promise.reject()
    }
}
