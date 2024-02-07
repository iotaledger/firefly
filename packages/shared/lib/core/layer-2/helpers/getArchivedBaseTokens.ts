import { get } from 'svelte/store'
import { activeProfile } from '@core/profile'
import { DEFAULT_CHAIN_CONFIGURATIONS } from '@core/network'

interface ArchivedResponse {
    baseTokens: number
}

export async function getArchivedBaseTokens(address: string): Promise<number> {
    const defaultChainConfig = DEFAULT_CHAIN_CONFIGURATIONS[get(activeProfile)?.network?.id]
    const URL = `${defaultChainConfig?.archiveEndpoint}/v1/chains/${defaultChainConfig?.aliasAddress}/core/accounts/account/${address}/balance`

    try {
        const archivedResponse: ArchivedResponse = await fetch(URL).then((response) => {
            if (response.status >= 400) {
                return response.json().then((err) => {
                    throw new Error(`Message: ${err.Message}, Error: ${err.Error}`)
                })
            }

            return response.json()
        })

        return archivedResponse.baseTokens
    } catch (_) {
        return 0
    }
}
