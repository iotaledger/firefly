import { get } from 'svelte/store'
import { activeProfile } from '@core/profile'
import { DEFAULT_CHAIN_CONFIGURATIONS } from '@core/network'

interface NonceResponse {
    nonce: string
}

export async function getNonceForWithdrawRequest(address: string): Promise<string> {
    const defaultChainConfig = DEFAULT_CHAIN_CONFIGURATIONS[get(activeProfile)?.network?.id]
    const URL = `${defaultChainConfig?.archiveEndpoint}/v1/chains/${defaultChainConfig?.chainId}/core/accounts/account/${address}/nonce`

    try {
        const nonceResponse: NonceResponse = await fetch(URL).then((response) => {
            if (response.status >= 400) {
                return response.json().then((err) => {
                    throw new Error(`Message: ${err.Message}, Error: ${err.Error}`)
                })
            }

            return response.json()
        })

        return nonceResponse.nonce
    } catch (error) {
        console.error(error)
        throw new Error(error.message)
    }
}
