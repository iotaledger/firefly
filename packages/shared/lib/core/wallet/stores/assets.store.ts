import { BASE_TOKEN, COIN_TYPE } from '@core/network'
import { activeProfile } from '@core/profile'
import { selectedAccount } from '@core/account'
import { derived, Readable } from 'svelte/store'
import { IAsset } from '@core/wallet'

export const assets: Readable<IAsset[]> = derived(
    [activeProfile, selectedAccount],
    ([$activeProfile, $selectedAccount]) => {
        if (!$activeProfile || !$selectedAccount) {
            return []
        }

        const assets: IAsset[] = [
            {
                id: COIN_TYPE[$activeProfile?.networkProtocol].toString(),
                metadata: BASE_TOKEN[$activeProfile?.networkProtocol],
                balance: {
                    total: Number($selectedAccount?.balances.total),
                    available: Number($selectedAccount?.balances.available),
                },
            },
        ]

        $selectedAccount?.balances?.nativeTokens?.forEach((nativeToken) => {
            assets.push({
                id: nativeToken.id,
                balance: {
                    total: Number(nativeToken.amount),
                    available: Number(nativeToken.amount),
                },
            })
        })

        return assets
    }
)
