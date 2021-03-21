<script lang="typescript">
    import { Icon, Text } from 'shared/components'
    import { walletRoute } from 'shared/lib/router'
    import { WalletRoutes } from 'shared/lib/typings/routes'
    import type { BalanceOverview } from 'shared/lib/wallet'
    import { getContext } from 'svelte'
    import type { Readable } from 'svelte/store'
    import { appSettings } from 'shared/lib/appSettings'

    export let locale
    export let color = 'blue' // TODO: profiles will have different colors

    let darkModeEnabled = $appSettings.darkMode

    const balance = getContext<Readable<BalanceOverview>>('walletBalance')
</script>

<style type="text/scss">
    wallet-balance {
        padding-top: 57px;
        padding-bottom: 42px;
        &.compressed {
            padding-top: 32px;
        }
        .bg-pattern {
            min-height: 234px;
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
    class:compressed={$walletRoute !== WalletRoutes.Init}>
    <!-- Balance -->
    <div data-label="total-balance" class="flex flex-col flex-wrap space-y-1.5">
        <p class="text-11 leading-120 text-white">{locale('general.totalBalance')}</p>
        <Text type="h2" overrideColor classes="text-white">{$balance.balance}</Text>
        <Text type="p" overrideColor smaller classes="text-{color}-200">{$balance.balanceFiat}</Text>
    </div>
    <img
        class="bg-pattern"
        width="100%"
        height="auto"
        src={`assets/patterns/${darkModeEnabled ? 'wallet-balance-darkmode.svg' : 'wallet-balance.svg'}`}
        alt="" />
    {#if $walletRoute === WalletRoutes.Init}
        <!-- Incoming/Outgoing -->
        <div data-label="total-movements" class="flex flex-row justify-between mt-8">
            <div class="flex items-center space-x-4">
                <Icon boxed icon="small-chevron-down" classes="text-green-600" boxClasses="bg-white dark:bg-gray-900" />
                <div>
                    <Text type="p" classes="text-white">{$balance.incoming}</Text>
                    <Text type="p" overrideColor smaller classes="text-{color}-200">{locale('general.incoming')}</Text>
                </div>
            </div>
            <div class="flex items-center space-x-4">
                <Icon boxed icon="small-chevron-up" classes="text-blue-500" boxClasses="bg-white dark:bg-gray-900" />
                <div>
                    <Text type="p" classes="text-white">{$balance.outgoing}</Text>
                    <Text type="p" overrideColor smaller classes="text-{color}-200">{locale('general.outgoing')}</Text>
                </div>
            </div>
        </div>
    {/if}
</wallet-balance>
