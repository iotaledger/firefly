<script lang="ts">
    import { IAccountState, selectedAccount, setSelectedAccount } from '@core/account'
    import { formatCurrency } from '@core/i18n'
    import { getMarketAmountFromAssetValue } from '@core/market/utils'
    import { activeProfile, getBaseToken } from '@core/profile'
    import { formatTokenAmountBestMatch, selectedWalletAssets } from '@core/wallet'
    import { FontWeight, Text, AccountLabel } from '@ui'

    export let account: IAccountState
    export let onClick: () => unknown
    export let id: string = ''

    $: ({ baseCoin } = $selectedWalletAssets[$activeProfile?.network?.id])

    function onAccountClick(accountIndex: number): void {
        setSelectedAccount(accountIndex)
        onClick && onClick()
    }
</script>

<button
    {id}
    on:click={() => onAccountClick(account.index)}
    class="hover:bg-gray-50 dark:hover:bg-gray-800 flex flex-row items-center justify-between py-2 px-4 rounded"
>
    <div class="flex flex-row items-center space-x-4">
        <AccountLabel selected={account.index === $selectedAccount?.index} {account} />
    </div>
    <div class="flex flex-col items-end space-x-1">
        <Text
            fontSize="14"
            lineHeight="20"
            fontWeight={FontWeight.semibold}
            classes="{account.index === $selectedAccount?.index ? '' : 'opacity-50'} text-right"
        >
            {formatTokenAmountBestMatch(Number(account.balances.baseCoin.total), getBaseToken())}
        </Text>
        <Text
            fontSize="12"
            fontWeight={FontWeight.semibold}
            lineHeight="20"
            color="blue-500"
            classes="{account.index === $selectedAccount?.index ? '' : 'opacity-50'} text-right"
        >
            {formatCurrency(getMarketAmountFromAssetValue(Number(account.balances.baseCoin.total), baseCoin))}
        </Text>
    </div>
</button>
