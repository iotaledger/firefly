<script lang="typescript">
    import { Text, Button, AccountTile } from 'shared/components'
    import { Send, Receive } from '.'

    export let locale
    export let mobile
    export let state
    export let _next
    export let _previous
    export let accounts
    export let WalletState
    export let selectAccount
    export let onGenerateAddress
    export let onInternalTransfer
    export let onSend
</script>

<div class="p-8 pt-4 flex flex-col h-full justify-between">
    <!-- Accounts -->
    {#if state === WalletState.Init || state === WalletState.Account}
        {#if state === WalletState.Init || state === WalletState.Account}
            <div data-label="accounts">
                <div class="flex flex-row mb-6 justify-between items-center">
                    <Text type="h5">{locale('general.accounts')}</Text>
                    <Button onClick={() => _next(WalletState.CreateAccount)} secondary small icon="plus">
                        {locale('actions.create')}
                    </Button>
                </div>
                {#if accounts.length > 0}
                    <div class="flex flex-row justify-between flex-wrap w-full px-2">
                        {#each accounts as account, i}
                            <AccountTile
                                color={account.color}
                                name={account.name}
                                balance={account.balance}
                                balanceEquiv={account.balanceEquiv}
                                width={accounts.length === 1 ? `full` : accounts.length === 2 ? `1/2` : `1/3`}
                                onClick={() => selectAccount(account.index)} />
                        {/each}
                    </div>
                {/if}
            </div>
        {/if}
        <!-- Action Send / Receive -->
        <div class="flex flex-row justify-between space-x-4">
            <Button xl secondary icon="receive" classes="w-1/2" onClick={() => _next(WalletState.Receive)}>
                {locale('actions.receive')}
            </Button>
            <Button xl secondary icon="transfer" classes="w-1/2" onClick={() => _next(WalletState.Send)}>
                {locale('actions.send')}
            </Button>
        </div>
    {:else if state === WalletState.Send}
        <Send on:next={_next} on:previous={_previous} onSend={onSend} onInternalTransfer={onInternalTransfer} {accounts} {locale} {mobile} />
    {:else if state === WalletState.Receive}
        <Receive on:next={_next} on:previous={_previous} {accounts} {locale} {mobile} onGenerateAddress={onGenerateAddress} />
    {/if}
</div>
