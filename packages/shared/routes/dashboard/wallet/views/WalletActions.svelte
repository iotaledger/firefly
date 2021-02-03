<script lang="typescript">
    import { getContext } from 'svelte'
    import { Text, Button, AccountTile } from 'shared/components'
    import { Send, Receive } from '.'
    import { selectedAccountId } from 'shared/lib/wallet'
    import { walletViewState, WalletViewStates, accountViewState, AccountViewStates } from 'shared/lib/router'

    export let locale
    export let send
    export let internalTransfer
    export let generateAddress

    const accounts = getContext('walletAccounts')

    function handleAccountClick(accountId) {
        selectedAccountId.set(accountId)
        walletViewState.set(WalletViewStates.Account)
        accountViewState.set(AccountViewStates.Init)
    }
    function handleCreateClick() {
        walletViewState.set(WalletViewStates.CreateAccount)
    }
    function handleSendClick() {
        walletViewState.set(WalletViewStates.Send)
    }
    function handleReceiveClick() {
        walletViewState.set(WalletViewStates.Receive)
    }
</script>

{#if $walletViewState === WalletViewStates.Init}
    <div class="p-8 pt-4 flex flex-col h-full justify-between">
        <div data-label="accounts" class="w-full h-full flex flex-col flex-no-wrap justify-start mb-6">
            <div class="flex flex-row mb-6 justify-between items-center">
                <Text type="h5">{locale('general.accounts')}</Text>
                <Button onClick={handleCreateClick} secondary small icon="plus">{locale('actions.create')}</Button>
            </div>
            {#if $accounts.length > 0}
                <div class="grid grid-cols-{$accounts.length <= 2 ? $accounts.length : '3'} gap-2 w-full flex-auto">
                    {#each $accounts as account}
                        <AccountTile
                            color={account.color}
                            name={account.name}
                            balance={account.balance}
                            balanceEquiv={account.balanceEquiv}
                            size={$accounts.length >= 3 ? 's' : $accounts.length === 2 ? 'm' : 'l'}
                            onClick={() => handleAccountClick(account.id)} />
                    {/each}
                </div>
            {/if}
        </div>
        <!-- Action Send / Receive -->
        <div class="flex flex-row justify-between space-x-4">
            <Button xl secondary icon="receive" classes="w-1/2" onClick={handleReceiveClick}>{locale('actions.receive')}</Button>
            <Button xl secondary icon="transfer" classes="w-1/2" onClick={handleSendClick}>{locale('actions.send')}</Button>
        </div>
    </div>
{:else if $walletViewState === WalletViewStates.Send}
    <Send {send} {internalTransfer} {locale} />
{:else if $walletViewState === WalletViewStates.Receive}
    <Receive {generateAddress} {locale} />
{/if}
