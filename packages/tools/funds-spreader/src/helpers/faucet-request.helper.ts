import axios, { AxiosResponse } from 'axios'

import { FAUCET_API_ENDPOINT } from '../constants'
import { IFaucetRequestData, IFaucetResponseData } from '../interfaces'

/**
 * Sends a request to the specific faucet
 */
export async function makeFaucetRequest(address: string): Promise<IFaucetResponseData> {
    if (!address) {
        throw new Error('Invalid address')
    }

    return new Promise((resolve) => {
        axios
            .post(FAUCET_API_ENDPOINT, prepareFaucetRequestData(address))
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
