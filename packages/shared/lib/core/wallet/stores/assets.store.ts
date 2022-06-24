import { BASE_TOKEN } from '@core/network'
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
                metadata: BASE_TOKEN[$activeProfile?.networkProtocol],
                balance: {
                    total: Number($selectedAccount?.balances.total),
                    available: Number($selectedAccount?.balances.available),
                },
            },
        ]
        return assets
    }
)
