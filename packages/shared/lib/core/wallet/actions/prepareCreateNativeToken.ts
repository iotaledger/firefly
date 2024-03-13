import { Converter } from '@core/utils'
import { CreateNativeTokenParams, PreparedCreateNativeTokenTransaction } from '@iota/sdk/out/types'
import { IIrc30Metadata } from '../interfaces'
import { getSelectedWallet } from '../stores'
import { getDefaultTransactionOptions } from '../utils'

export async function prepareCreateNativeToken(
    maximumSupply: number,
    circulatingSupply: number,
    metadata: IIrc30Metadata
): Promise<PreparedCreateNativeTokenTransaction | undefined> {
    try {
        const wallet = getSelectedWallet()
        if (!wallet) return
        const params: CreateNativeTokenParams = {
            maximumSupply: BigInt(maximumSupply),
            circulatingSupply: BigInt(circulatingSupply),
            foundryMetadata: Converter.utf8ToHex(JSON.stringify(metadata)),
        }

        return wallet.prepareCreateNativeToken(params, getDefaultTransactionOptions())
    } catch (err) {
        return Promise.reject(err)
    }
}
