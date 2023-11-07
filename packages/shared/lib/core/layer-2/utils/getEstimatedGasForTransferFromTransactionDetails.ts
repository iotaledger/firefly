import { localize } from '@core/i18n'
import { getActiveProfile } from '@core/profile'
import BigInteger from 'big-integer'
import { ILayer2GasEstimatePayload } from '../interfaces'

export async function getEstimatedGasForTransferFromTransactionDetails(
    serializedOutputHex: string
): Promise<ILayer2GasEstimatePayload> {
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

            if (gasBurned && gasFeeCharged) {
                return { gasBurned, gasFeeCharged }
            }
        }

        throw new Error(localize('error.layer2.estimatedGas'))
    }

    return {}
}
