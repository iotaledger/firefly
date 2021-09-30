<script lang="typescript">
    import { Button } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { appSettings } from 'shared/lib/appSettings'
    import { walletRoute } from 'shared/lib/router'
    import { WalletRoutes } from 'shared/lib/typings/routes'
    import type { BalanceOverview, WalletAccount } from 'shared/lib/wallet'
    import { getContext } from 'svelte'
    import type { Readable, Writable } from 'svelte/store'

    export let locale
    export let color = 'blue' // TODO: profiles will have different colors

    $: darkModeEnabled = $appSettings.darkMode

    const balance = getContext<Readable<BalanceOverview>>('walletBalance')
    const accounts = getContext<Writable<WalletAccount[]>>('walletAccounts')

    function handleSendClick() {
        walletRoute.set(WalletRoutes.Send)
    }
    function handleReceiveClick() {
        walletRoute.set(WalletRoutes.Receive)
    }
</script>

<style type="text/scss">
    wallet-balance {
        @apply pt-8;
        padding-bottom: 42px;
        &.compressed {
            padding-top: 32px;
        }
        &.mobile {
            padding-bottom: 0px;
            background: transparent;
        }
        .bg-pattern {
            min-height: 234px;
            z-index: -1;
            @apply absolute;
            @apply w-full;
            @apply h-full;
            @apply h-auto;
            @apply object-cover;
            @apply top-0;
            @apply left-0;
        }
    }
</style>

<wallet-balance
    class="relative z-0 bg-gradient-to-b from-{color}-500 to-{color}-600 dark:from-gray-800 dark:to-gray-900 rounded-t-xl px-8"
    class:compressed={$walletRoute !== WalletRoutes.Init}
    class:mobile={$mobile}>
    <!-- Balance -->
    <div data-label="total-balance" class="flex flex-col flex-wrap space-y-5">
        {#if !mobile}
            <p class="text-11 leading-120 text-white uppercase tracking-widest">{locale('general.balance')}</p>
        {/if}
        <div class="flex flex-{$mobile ? 'col justify-end items-start' : 'row justify-between items-end'}">
            <p class="text-28 leading-120 {$mobile ? 'text-black dark:text-white' : 'text-white'} font-600">{$balance.balance}</p>
            <p class="text-12 leading-140 {$mobile ? 'text-gray-500' : 'text-white'} font-600">{$balance.balanceFiat}</p>
        </div>
    </div>
    <img
        class="bg-pattern"
        width="100%"
        height="auto"
        src={`assets/patterns/${darkModeEnabled ? 'wallet-balance-darkmode.svg' : 'wallet-balance.svg'}`}
        alt="" />
    {#if $walletRoute === WalletRoutes.Init || $mobile}
        {#if $accounts.length > 0 || $mobile}
            <!-- Action Send / Receive -->
            <div class="flex flex-row justify-between space-x-4 mt-7 mb-3">
                <Button medium secondary classes="w-full" onClick={handleReceiveClick}>{locale('actions.receive')}</Button>
                <Button medium secondary classes="w-full" onClick={handleSendClick}>{locale('actions.send')}</Button>
            </div>
        {/if}
    {/if}
</wallet-balance>
