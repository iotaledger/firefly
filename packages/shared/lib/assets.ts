import { Unit } from '@iota/unit-converter'
import { convertToFiat, currencies, exchangeRates, formatNumber } from 'shared/lib/currency'
import { formatStakingAirdropReward } from 'shared/lib/participation/staking'
import { totalAssemblyStakingRewards, totalShimmerStakingRewards } from 'shared/lib/participation/account'
import { activeProfile } from 'shared/lib/profile'
import { Asset, Token } from 'shared/lib/typings/assets'
import { AvailableExchangeRates, CurrencyTypes } from 'shared/lib/typings/currency'
import { UNIT_MAP } from 'shared/lib/units'
import { selectedAccountStore } from 'shared/lib/wallet'
import { derived } from 'svelte/store'
import { StakingAirdrop } from 'shared/lib/participation/types'
import { getNumberOfDecimalPlaces } from '@lib/utils'

export const assets = derived(
    [
        exchangeRates,
        currencies,
        activeProfile,
        selectedAccountStore,
        totalAssemblyStakingRewards,
        totalShimmerStakingRewards,
    ],
    ([
        $exchangeRates,
        $currencies,
        $activeProfile,
        $selectedAccount,
        $assemblyStakingRewards,
        $shimmerStakingRewards,
    ]) => {
        if (!$activeProfile || !$selectedAccount) return []
        const profileCurrency = $activeProfile?.settings.currency ?? AvailableExchangeRates.USD

        const rawFiatPrice = convertToFiat(
            UNIT_MAP[Unit.Mi].val,
            $currencies?.[CurrencyTypes.USD],
            $exchangeRates?.[profileCurrency]
        )
        const numDecimalPlaces = getNumberOfDecimalPlaces(rawFiatPrice)
        const formattedFiatPrice = formatNumber(rawFiatPrice, numDecimalPlaces, numDecimalPlaces)

        const assets: Asset[] = [
            {
                name: Token.IOTA,
                balance: $selectedAccount.balance,
                fiatPrice: `${formattedFiatPrice} ${profileCurrency}`,
                fiatBalance: $selectedAccount.balanceEquiv,
                color: '#6E82A4',
            },
        ]
        if ($assemblyStakingRewards) {
            assets.push({
                name: Token.Assembly,
                balance: formatStakingAirdropReward(StakingAirdrop.Assembly, Number($assemblyStakingRewards), 2),
                color: '#DCABE1',
            })
        }
        if ($shimmerStakingRewards) {
            assets.push({
                name: Token.Shimmer,
                balance: formatStakingAirdropReward(StakingAirdrop.Shimmer, Number($shimmerStakingRewards), 2),
                color: '#25DFCA',
            })
        }
        return assets
    }
)
