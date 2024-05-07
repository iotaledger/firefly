import { get } from 'svelte/store'
import { activeProfile } from '@core/profile'
import { DEFAULT_CHAIN_CONFIGURATIONS } from '@core/network'

const TIMEOUT_SECONDS = 5
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getL2ReceiptByRequestId(requestId: string): Promise<any> {
    const defaultChainConfig = DEFAULT_CHAIN_CONFIGURATIONS[get(activeProfile)?.network?.id]
    let URL = `${defaultChainConfig?.archiveEndpoint}/v1/chains/${defaultChainConfig?.aliasAddress}/requests/${requestId}/wait?`

    const queryParams: {
        [key: string]: number | boolean
    } = {
        timeoutSeconds: TIMEOUT_SECONDS,
        waitForL1Confirmation: true,
    }

    const queryString = Object.keys(queryParams)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
        .join('&')

    URL += queryString

    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            accept: 'application/json',
        },
    }

    try {
        const response = await fetch(URL, requestOptions)

        if (response.status >= 400) {
            return response.json().then((err) => {
                throw new Error(`Message: ${err.Message}, Error: ${err.Error}`)
            })
        }
        return response.json()
    } catch (error) {
        console.error(error)
        throw new Error(error.message)
    }
}
