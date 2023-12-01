<script lang="ts">
    import { IWalletState, selectedWallet, setSelectedWallet } from '@core/wallet'
    import { formatCurrency } from '@core/i18n'
    import { getMarketAmountFromAssetValue } from '@core/market/utils'
    import { activeProfile, getBaseToken } from '@core/profile'
    import { formatTokenAmountBestMatch, selectedWalletAssets } from '@core/wallet'
    import { FontWeight, Text, WalletLabel } from '@ui'

    export let wallet: IWalletState
    export let onClick: () => unknown
    export let id: string = ''

    $: ({ baseCoin } = $selectedWalletAssets[$activeProfile?.network?.id])

    function onAccountClick(walletId: string): void {
        setSelectedWallet(walletId)
        onClick && onClick()
    }
</script>

<button
    {id}
    on:click={() => onAccountClick(wallet.id)}
    class="hover:bg-gray-50 dark:hover:bg-gray-800 flex flex-row items-center justify-between py-2 px-4 rounded"
>
    <div class="flex flex-row items-center space-x-4">
        <WalletLabel selected={wallet.id === $selectedWallet?.id} {wallet} />
    </div>
    <div class="flex flex-col items-end space-x-1">
        <Text
            fontSize="14"
            lineHeight="20"
            fontWeight={FontWeight.semibold}
            classes="{wallet.id === $selectedWallet?.id ? '' : 'opacity-50'} text-right"
        >
            {formatTokenAmountBestMatch(Number(wallet.balances.baseCoin.total), getBaseToken())}
        </Text>
        <Text
            fontSize="12"
            fontWeight={FontWeight.semibold}
            lineHeight="20"
            color="blue-500"
            classes="{wallet.id === $selectedWallet?.id ? '' : 'opacity-50'} text-right"
        >
            {formatCurrency(getMarketAmountFromAssetValue(Number(wallet.balances.baseCoin.total), baseCoin))}
        </Text>
    </div>
</button>
