import { selectedAccount } from '@core/account'
import { COIN_TYPE } from '@core/network'
import { activeProfile } from '@core/profile'
import { isValidIRC30 } from '@lib/utils/isValidIRC30'
import { get } from 'svelte/store'
import { IAsset } from '../interfaces'
import { IAccountAssets } from '../interfaces/account-assets.interface'
import { getAssetFromPersistedAssets } from '../utils'
import { sortAssets } from '../utils/sortAssets'

export function getAccountAssetsForSelectedAccount(): IAccountAssets {
    const account = get(selectedAccount)
    const networkProtocol = get(activeProfile)?.networkProtocol

    const persistedBaseCoin = getAssetFromPersistedAssets(COIN_TYPE[networkProtocol].toString())
    const baseCoin: IAsset = {
        ...persistedBaseCoin,
        balance: {
            total: Number(account?.balances?.baseCoin?.total),
            available: Number(account?.balances?.baseCoin?.available),
        },
    }

    const nativeTokens: IAsset[] = []
    for (const token of account?.balances?.nativeTokens) {
        const persistedAsset = getAssetFromPersistedAssets(token.tokenId)
        if (persistedAsset && isValidIRC30(persistedAsset.metadata)) {
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
        nativeTokens: sortAssets(nativeTokens),
    }
}
