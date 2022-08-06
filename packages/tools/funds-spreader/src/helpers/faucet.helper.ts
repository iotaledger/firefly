import axios from 'axios'

import { Address, CoinType } from '@iota/wallet'

import { FAUCET_REQUEST_SLEEP_INTERVAL, IOTA_FAUCET_API_ENDPOINT, SHIMMER_FAUCET_API_ENDPOINT } from '../constants'
import { IFaucetRequestData } from '../interfaces'
import { sleep } from '../utils'

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

/**
 * Requests funds from the given faucet API endpoint for all of the given addresses.
 */
export async function makeFaucetRequests(faucetApiEndpoint: string, addresses: Address[]): Promise<void> {
    await Promise.all(
        addresses.map(async (address) => {
            await makeFaucetRequest(faucetApiEndpoint, address?.address)
            await sleep(FAUCET_REQUEST_SLEEP_INTERVAL)
        })
    )
}

async function makeFaucetRequest(faucetApiEndpoint: string, address: string): Promise<void> {
    if (!address) {
        throw new Error('Invalid address')
    }

    await axios.post(faucetApiEndpoint, prepareFaucetRequestData(address))
}

function prepareFaucetRequestData(address: string): IFaucetRequestData {
    return {
        address,
    }
}
