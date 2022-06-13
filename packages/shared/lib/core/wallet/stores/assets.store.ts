import { BASE_TOKEN, NetworkProtocol } from '@core/network'
import { convertToFiat, currencies, exchangeRates } from 'shared/lib/currency'
import { activeProfile } from '@core/profile'
import { AvailableExchangeRates, CurrencyTypes } from 'shared/lib/typings/currency'
import { UNIT_MAP, Unit } from 'shared/lib/units'
import { selectedAccount } from '@core/account'
import { derived, Readable } from 'svelte/store'
import { IAsset } from '@core/wallet'

export const assets: Readable<IAsset[]> = derived(
    [exchangeRates, currencies, activeProfile, selectedAccount],
    ([$exchangeRates, $currencies, $activeProfile, $selectedAccount]) => {
        if (!$activeProfile || !$selectedAccount) return []
        const profileCurrency = $activeProfile?.settings?.currency ?? AvailableExchangeRates.USD
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
