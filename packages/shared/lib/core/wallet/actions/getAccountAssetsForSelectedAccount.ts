import { selectedAccount } from '@core/account'
import { COIN_TYPE } from '@core/network'
import { activeProfile } from '@core/profile'
import { get } from 'svelte/store'
import { IAsset } from '../interfaces'
import { IAccountAssets } from '../interfaces/account-assets.interface'
import { getAssetFromPersistedAssets } from '../utils'
import { isFilteredAsset } from '../utils/isFilteredAsset'

export function getAccountAssetsForSelectedAccount(): IAccountAssets {
    const account = get(selectedAccount)
    const networkProtocol = get(activeProfile)?.networkProtocol

    const persistedBaseCoin = getAssetFromPersistedAssets(COIN_TYPE[networkProtocol].toString())
    const baseCoin: IAsset = !isFilteredAsset(persistedBaseCoin)
        ? {
              ...persistedBaseCoin,
              balance: {
                  total: Number(account?.balances?.baseCoin?.total),
                  available: Number(account?.balances?.baseCoin?.available),
              },
          }
        : undefined

    const nativeTokens: IAsset[] = []
    const tokens = account?.balances?.nativeTokens ?? []
    for (const token of tokens) {
        const persistedAsset = getAssetFromPersistedAssets(token.tokenId)
        if (persistedAsset && !isFilteredAsset(persistedAsset)) {
            nativeTokens.push({
                ...persistedAsset,
                balance: {
                    total: Number(token.total),
                    available: Number(token.available),
                },
            })
        }
    }

    return {
        baseCoin,
        nativeTokens,
    }
}
