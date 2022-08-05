import axios, { AxiosResponse } from 'axios'

import { CoinType } from '@iota/wallet'

import { IOTA_FAUCET_API_ENDPOINT, SHIMMER_FAUCET_API_ENDPOINT } from '../constants'
import { IFaucetRequestData, IFaucetResponseData } from '../interfaces'

/**
 * Returns a Promise of the response data from the faucet request.
 */
export async function makeFaucetRequest(faucetApiEndpoint: string, address: string): Promise<IFaucetResponseData> {
    if (!address) {
        throw new Error('Invalid address')
    }

    return new Promise((resolve) => {
        axios
            .post(faucetApiEndpoint, prepareFaucetRequestData(address))
            .then((response: AxiosResponse<IFaucetResponseData>) => {
                resolve(response?.data)
            })
            .catch((error) => {
                console.error(error)
                process.exit(1)
            })
    })
}

function prepareFaucetRequestData(address: string): IFaucetRequestData {
    return {
        address,
    }
}

/**
 * Returns the corresponding faucet API endpoint given a specific coin type.
 */
export function getFaucetApiEndpoint(coinType: CoinType): string {
    switch (coinType) {
        case CoinType.IOTA:
            return IOTA_FAUCET_API_ENDPOINT
        case CoinType.Shimmer:
            return SHIMMER_FAUCET_API_ENDPOINT
        default:
            return ''
    }
}
