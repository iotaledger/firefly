import BigInteger from 'big-integer'
import { getActiveProfile } from '@core/profile'

interface GasEstimatePayload {
    gasBurned?: number
    gasFeeCharged?: number
}

export async function getEstimatedGasForTransferFromTransactionDetails(
    serializedOutputHex: string
): Promise<GasEstimatePayload> {
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
            const gasBurned = BigInteger(data.gasBurned as string).toJSNumber()
            const gasFeeCharged = BigInteger(data.gasFeeCharged as string).toJSNumber()

            return { gasBurned, gasFeeCharged }
        }
    }

    return {}
}
