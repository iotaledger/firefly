import { Unit } from '@iota/unit-converter'
import { convertToFiat, currencies, exchangeRates } from 'shared/lib/currency'
import { formatStakingAirdropReward } from 'shared/lib/participation/staking'
import { assemblyStakingRewards, shimmerStakingRewards } from 'shared/lib/participation/stores'
import { activeProfile } from 'shared/lib/profile'
import { Asset, Token } from 'shared/lib/typings/assets'
import { AvailableExchangeRates, CurrencyTypes } from 'shared/lib/typings/currency'
import { UNIT_MAP } from 'shared/lib/units'
import { selectedAccount } from 'shared/lib/wallet'
import { derived } from 'svelte/store'
import { StakingAirdrop } from './participation/types'

export const assets = derived(
    [exchangeRates, currencies, activeProfile, selectedAccount, assemblyStakingRewards, shimmerStakingRewards],
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
                balance: formatStakingAirdropReward(StakingAirdrop[Token.Assembly], Number($assemblyStakingRewards), 6),
                color: '#DCABE1',
            })
        }
        if ($shimmerStakingRewards) {
            assets.push({
                name: Token.Shimmer,
                balance: formatStakingAirdropReward(StakingAirdrop[Token.Shimmer], Number($shimmerStakingRewards), 6),
                color: '#25DFCA',
            })
        }
        return assets
    }
)
