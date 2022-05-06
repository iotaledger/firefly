import { Unit } from '@iota/unit-converter'

import { convertToFiat, currencies, exchangeRates } from 'shared/lib/currency'
import { activeProfile } from 'shared/lib/profile'
import { Asset, BASE_TOKEN } from 'shared/lib/typings/assets'
import { AvailableExchangeRates, CurrencyTypes } from 'shared/lib/typings/currency'
import { UNIT_MAP } from 'shared/lib/units'
import { selectedAccount } from 'shared/lib/wallet'
import { derived } from 'svelte/store'
import { NetworkProtocol } from './typings/network'

export const assets = derived(
    [exchangeRates, currencies, activeProfile, selectedAccount],
    ([$exchangeRates, $currencies, $activeProfile, $selectedAccount]) => {
        if (!$activeProfile || !$selectedAccount) return []
        const profileCurrency = $activeProfile?.settings.currency ?? AvailableExchangeRates.USD
        const assets: Asset[] = [
            {
                meta: BASE_TOKEN[$activeProfile.networkProtocol],
                rawBalance: 0,
                fiatPrice: `${convertToFiat(
                    UNIT_MAP[Unit.Mi].val,
                    $currencies[CurrencyTypes.USD],
                    $exchangeRates[profileCurrency]
                )} ${profileCurrency}`,
                fiatBalance: '0 USD',
            },
        ]
        return assets
    }
)
