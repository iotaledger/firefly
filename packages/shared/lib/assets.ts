import { Unit } from '@iota/unit-converter'
import { convertToFiat, currencies, exchangeRates } from 'shared/lib/currency'
import { formatStakingAirdropReward } from 'shared/lib/participation/staking'
import { totalAssemblyStakingRewards, totalShimmerStakingRewards } from 'shared/lib/participation/stores'
import { activeProfile } from 'shared/lib/profile'
import { Asset, Token } from 'shared/lib/typings/assets'
import { AvailableExchangeRates, CurrencyTypes } from 'shared/lib/typings/currency'
import { UNIT_MAP } from 'shared/lib/units'
import { selectedAccount } from 'shared/lib/wallet'
import { derived } from 'svelte/store'
import { StakingAirdrop } from 'shared/lib/participation/types'

export const assets = derived(
    [
        exchangeRates,
        currencies,
        activeProfile,
        selectedAccount,
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
        const assets: Asset[] = [
            {
                name: Token.IOTA,
                balance: $selectedAccount.balance,
                fiatPrice: `${convertToFiat(
                    UNIT_MAP[Unit.Mi].val,
                    $currencies[CurrencyTypes.USD],
                    $exchangeRates[profileCurrency]
                )} ${profileCurrency}`,
                fiatBalance: $selectedAccount.balanceEquiv,
                color: '#6E82A4',
            },
        ]
        if ($assemblyStakingRewards) {
            assets.push({
                name: Token.Assembly,
                balance: formatStakingAirdropReward(StakingAirdrop[Token.Assembly], Number($assemblyStakingRewards), 2),
                color: '#DCABE1',
            })
        }
        if ($shimmerStakingRewards) {
            assets.push({
                name: Token.Shimmer,
                balance: formatStakingAirdropReward(StakingAirdrop[Token.Shimmer], Number($shimmerStakingRewards), 2),
                color: '#25DFCA',
            })
        }
        return assets
    }
)
