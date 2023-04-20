<script lang="ts">
    import { Text, TextType } from '@ui'
    import { AccountLabel } from '@ui/atoms'
    import { IAccountState, selectedAccount, setSelectedAccount } from '@core/account'
    import { getBaseToken } from '@core/profile'
    import { formatTokenAmountBestMatch } from '@core/wallet'

    export let account: IAccountState
    export let onClick: () => unknown
    export let id: string = ''

    function onAccountClick(accountIndex: number): void {
        setSelectedAccount(accountIndex)
        onClick && onClick()
    }
</script>

<button {id} on:click={() => onAccountClick(account.index)} class="flex flex-row justify-between py-4">
    <AccountLabel fontSize="15" selected={account.index === $selectedAccount?.index} {account} />
    <Text classes={account.index === $selectedAccount?.index ? '' : 'opacity-50'} type={TextType.h5}>
        {formatTokenAmountBestMatch(Number(account.balances.baseCoin.total), getBaseToken())}
    </Text>
</button>
