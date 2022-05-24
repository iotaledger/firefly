import { BASE_TOKEN } from '@core/network'
import { convertToFiat, currencies, exchangeRates } from 'shared/lib/currency'
import { activeProfile } from '@core/profile'
import { AvailableExchangeRates, CurrencyTypes } from 'shared/lib/typings/currency'
import { UNIT_MAP, Unit } from 'shared/lib/units'
import { selectedAccount } from '@core/account'
import { derived } from 'svelte/store'
import { IAsset } from '@core/wallet'

export const assets = derived(
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
                fiatPrice: `${convertToFiat(
                    UNIT_MAP[Unit.M].val,
                    $currencies[CurrencyTypes.USD],
                    $exchangeRates[profileCurrency]
                )} ${profileCurrency}`,
                fiatBalance: `${convertToFiat(
                    Number($selectedAccount?.balances.available),
                    $currencies[CurrencyTypes.USD],
                    $exchangeRates[profileCurrency]
                )} ${profileCurrency}`,
            },
        ]
        return assets
    }
)
