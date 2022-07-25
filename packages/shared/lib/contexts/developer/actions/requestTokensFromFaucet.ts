import { selectedAccount } from '@core/account'
import { showAppNotification } from '@lib/notifications'
import { get } from 'svelte/store'

export async function requestTokensFromFaucet(): Promise<void> {
    const url = 'https://faucet.testnet.shimmer.network/api/enqueue'

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
                message: 'Faucet request sent successfully',
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
}
