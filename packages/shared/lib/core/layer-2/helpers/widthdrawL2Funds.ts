import { get } from 'svelte/store'
import { activeProfile } from '@core/profile'
import { DEFAULT_CHAIN_CONFIGURATIONS } from '@core/network'

interface Response {
    baseTokens: number
}

export async function withdrawFunds(address: string): Promise<number> {
    const defaultChainConfig = DEFAULT_CHAIN_CONFIGURATIONS[get(activeProfile)?.network?.id]
    // todo: change to withdraw endpoint
    const URL = `${defaultChainConfig?.archiveEndpoint}/core/accounts/account/${address}/balance`

    try {
        const res: Response = await fetch(URL).then((r) => r.json())

        return res.baseTokens
    } catch (_) {
        return 0
    }
}
