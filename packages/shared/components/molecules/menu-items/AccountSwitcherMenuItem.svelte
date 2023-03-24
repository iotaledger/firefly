<script lang="ts">
    import { Text, FontWeight } from 'shared/components'
    import { AccountLabel } from 'shared/components/atoms'
    import { IAccountState, selectedAccount, setSelectedAccount } from '@core/account'
    import { BASE_TOKEN } from '@core/network'
    import { activeProfile } from '@core/profile'
    import { formatTokenAmountBestMatch, selectedAccountAssets } from '@core/wallet'
    import { getMarketAmountFromAssetValue } from '@core/market/utils'
    import { formatCurrency } from '@core/i18n'

    export let account: IAccountState
    export let onClick: () => unknown
    export let id: string = ''

    $: ({ baseCoin } = $selectedAccountAssets)

    function onAccountClick(accountIndex: number): void {
        setSelectedAccount(accountIndex)
        onClick && onClick()
    }
</script>

<button
    {id}
    on:click={() => onAccountClick(account.index)}
    class="hover:bg-gray-50 dark:hover:bg-gray-800 flex flex-row justify-between p-4 rounded"
>
    <div class="flex flex-row items-center space-x-4">
        <AccountLabel selected={account.index === $selectedAccount?.index} {account} />
    </div>
    <div class="flex flex-row items-end space-x-1">
        <Text
            fontSize="14"
            fontWeight={FontWeight.semibold}
            classes="{account.index === $selectedAccount?.index ? '' : 'opacity-50'} text-right"
        >
            {formatTokenAmountBestMatch(
                Number(account.balances.baseCoin.total),
                BASE_TOKEN[$activeProfile.networkProtocol]
            )}
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
