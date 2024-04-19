import { get } from 'svelte/store'
import { activeProfile } from '@core/profile'
import { DEFAULT_CHAIN_CONFIGURATIONS } from '@core/network'

export async function withdrawL2Funds(requestHex: string): Promise<void> {
    const defaultChainConfig = DEFAULT_CHAIN_CONFIGURATIONS[get(activeProfile)?.network?.id]
    const URL = `${defaultChainConfig?.archiveEndpoint}/v1/requests/offledger`

    const request = {
        chainId: defaultChainConfig?.anchorAddress,
        request: requestHex,
    }

    const requestOptions = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    }

    try {
        const response = await fetch(URL, requestOptions)

        if (response.status >= 400) {
            return response.json().then((err) => {
                throw new Error(`Message: ${err.Message}, Error: ${err.Error}`)
            })
        }
    } catch (error) {
        console.error(error)
        throw new Error(error.message)
    }
}
