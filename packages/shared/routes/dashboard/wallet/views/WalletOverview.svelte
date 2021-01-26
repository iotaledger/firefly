<script lang="typescript">
    import { DashboardPane } from 'shared/components'
    import { CreateAccount, WalletBalance, WalletActions } from '.'

    export let locale
    export let mobile
    export let state
    export let _next
    export let _previous
    export let accounts
    export let totalBalance
    export let color = 'blue'
    export let WalletState
    export let selectAccount
    export let onSend
    export let onGenerateAddress
    export let onInternalTransfer
</script>

<!-- Total Balance, Accounts list & Send/Receive -->
<div class="flex flex-auto flex-col flex-shrink-0 h-full">
    {#if state === WalletState.CreateAccount}
        <CreateAccount on:next={_next} on:previous={_previous} {locale} {mobile} />
    {:else}
        <WalletBalance {locale} {mobile} {state} {totalBalance} {color} {WalletState} />
        <DashboardPane classes="-mt-5 h-full">
            <WalletActions {locale} {mobile} {state} {_next} {_previous} {accounts} {WalletState} {selectAccount} {onGenerateAddress} {onInternalTransfer} {onSend}/>
        </DashboardPane>
    {/if}
</div>
