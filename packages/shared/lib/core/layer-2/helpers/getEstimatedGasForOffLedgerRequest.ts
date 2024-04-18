import { get } from 'svelte/store'
import { activeProfile } from '@core/profile'
import { DEFAULT_CHAIN_CONFIGURATIONS } from '@core/network'
import BigInteger from 'big-integer'
import { HexEncodedString } from '@iota/sdk/out/types'

interface GasEstimatePayload {
    gasBurned?: number
    gasFeeCharged?: number
}

export async function getEstimatedGasForOffLedgerRequest(requestHex: HexEncodedString): Promise<GasEstimatePayload> {
    const defaultChainConfig = DEFAULT_CHAIN_CONFIGURATIONS[get(activeProfile)?.network?.id]
    const URL = `${defaultChainConfig?.archiveEndpoint}/v1/chains/${defaultChainConfig?.chainId}/estimategas-offledger`

    const requestOptions = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            requestBytes: requestHex,
        }),
    }

    try {
        const response = await fetch(URL, requestOptions)

        if (response.status >= 400) {
            return response.json().then((err) => {
                throw new Error(`Message: ${err.Message}, Error: ${err.Error}`)
            })
        }

        if (response.status === 200) {
            const data = await response.json()
            if (data.errorMessage) {
                throw new Error(data.errorMessage)
            }
            const gasBurned = BigInteger(data.gasBurned as string).toJSNumber()
            const gasFeeCharged = BigInteger(data.gasFeeCharged as string).toJSNumber()

            return { gasBurned, gasFeeCharged }
        }
    } catch (error) {
        console.error(error)
        throw new Error(error.message)
    }
    return {}
}
