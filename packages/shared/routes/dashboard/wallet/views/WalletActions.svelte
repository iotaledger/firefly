<script lang="typescript">
    import { createEventDispatcher, getContext } from 'svelte'
    import { Text, Button, AccountTile } from 'shared/components'
    import { Send, Receive } from '.'
    import { WalletState } from '../Wallet.svelte'

    export let locale
    export let send
    export let internalTransfer
    export let generateAddress

    const dispatch = createEventDispatcher()
    const accounts = getContext('walletAccounts')
    const state = getContext('walletState')

    function handleAccountClick(accountId) {
        dispatch('next', { accountId })
    }
    function handleCreateClick() {
        dispatch('next', WalletState.CreateAccount)
    }
    function handleSendClick() {
        dispatch('next', WalletState.Send)
    }
    function handleReceiveClick() {
        dispatch('next', WalletState.Receive)
    }
</script>

{#if $state === WalletState.Init}
    <div class="p-8 pt-4 flex flex-col h-full justify-between">
        <div data-label="accounts">
            <div class="flex flex-row mb-6 justify-between items-center">
                <Text type="h5">{locale('general.accounts')}</Text>
                <Button onClick={handleCreateClick} secondary small icon="plus">{locale('actions.create')}</Button>
            </div>
            {#if $accounts.length > 0}
                <div class="flex flex-row justify-between flex-wrap w-full px-2">
                    {#each $accounts as account}
                        <AccountTile
                            color={account.color}
                            name={account.name}
                            balance={account.balance}
                            balanceEquiv={account.balanceEquiv}
                            width={$accounts.length === 1 ? `full` : $accounts.length === 2 ? `1/2` : `1/3`}
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
{:else if $state === WalletState.Send}
    <Send on:next on:previous {send} {internalTransfer} {locale} />
{:else if $state === WalletState.Receive}
    <Receive on:next on:previous {generateAddress} {locale} />
{/if}
