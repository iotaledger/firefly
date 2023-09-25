import BigInteger from 'big-integer'
import { GAS_BUDGET } from '../constants'
import { getActiveProfile } from '@core/profile'

export async function getEstimatedGasForTransferFromTransactionDetails(serializedOutputHex: string): Promise<number> {
    const profile = getActiveProfile()
    const chainMetadata = profile.network?.chains?.[0] ?? null

    if (chainMetadata) {
        const URL = `${chainMetadata.iscpEndpoint}/estimategas-onledger`

        const body = JSON.stringify({ outputBytes: serializedOutputHex })

        const requestInit: RequestInit = {
            method: 'POST',
            body,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }

        const response = await fetch(URL, requestInit)

        if (response.status === 200) {
            const data = await response.json()
            return BigInteger(data.gasBurned as string).toJSNumber()
        }
    }

    return Promise.resolve(GAS_BUDGET.toJSNumber())
}
