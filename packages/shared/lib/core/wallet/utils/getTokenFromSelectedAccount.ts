import { getActiveNetworkId } from '@core/network/utils/getNetworkId'
import { get } from 'svelte/store'
import { IAsset } from '../interfaces'
import { selectedWalletAssets } from '../stores'

export function getTokenFromSelectedAccount(tokenId: string): IAsset | undefined {
    const networkId = getActiveNetworkId()
    if (!networkId) {
        return undefined
    } else {
        return get(selectedWalletAssets)[networkId]?.nativeTokens?.find((asset) => tokenId === asset.id)
    }
}
