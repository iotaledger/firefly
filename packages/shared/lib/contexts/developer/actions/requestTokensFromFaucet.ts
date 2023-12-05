import { selectedWallet } from '@core/wallet'
import { localize } from '@core/i18n'
import { FAUCET_URLS } from '@core/network'
import { showAppNotification } from '@auxiliary/notification'
import { get } from 'svelte/store'
import { getActiveNetworkId } from '@core/network/utils/getNetworkId'

export async function requestTokensFromFaucet(): Promise<void> {
    const networkId = getActiveNetworkId()
    if (!networkId) {
        return
    }

    const url = FAUCET_URLS?.[networkId]

    if (!url) {
        return Promise.reject()
    }
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')

    const address = get(selectedWallet)?.depositAddress
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
    } catch (err) {
        return Promise.reject(err)
    }
}
