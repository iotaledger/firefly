import { GAS_BUDGET } from '../constants'
import { getActiveProfile } from '@core/profile';

export async function getEstimatedGasForTransferFromTransactionDetails(serializedOutputHex: string): Promise<number> {
    const profile = getActiveProfile();
    const chainMetadata = profile.network?.chains?.[0] ?? null

    if (chainMetadata) {
        // const endpoint = chainMetadata.iscpEndpoint
        const endpoint = '7-teamnet.chrysalis2.com'

        // we should probably hash the chainId from chainMetadata.chainId ?
        const chainId = 'rms1ppnkvsjctdg53v2x89uzhuxg89s073jmn2nuzcw44tggjy8rzzgzq2rg0qp'

        const URL = `${endpoint}/wasp/api/v1/chains/${chainId}/estimategas-onledger`
        const body = JSON.stringify({ outputBytes: serializedOutputHex })

        const requestInit: RequestInit = {
            method: 'POST',
            body,
            headers: {
                Accept: 'application/json',
               'Content-Type': 'application/json'
            }
        }

        const response = await fetch(URL, requestInit)

        if (response.status === 200) {
            const data = await response.json()

            return data.gasBudget
        }
    }

    return Promise.resolve(GAS_BUDGET.toJSNumber())
}
