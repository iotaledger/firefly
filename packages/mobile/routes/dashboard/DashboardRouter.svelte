<script lang="typescript">
    import { selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { BASE_TOKEN } from '@core/network'
    import { activeProfile } from '@core/profile'
    import { Button, TogglableAmountLabel } from 'shared/components'
    import { TabPane, TopBar } from '../../../mobile/components'
    import features from '../../features/features'
    import { activeWalletTab, WALLET_TAB_COMPONENT } from '../../lib/contexts/wallet'
    import { dashboardRoute, DashboardRoute, dashboardRouter } from '../../lib/core/router'
    import { ReceiveDrawer } from './wallet/drawers'
    import { TabNavigator } from './wallet/tabs'

    $: activeWalletTabComponent = WALLET_TAB_COMPONENT[$activeWalletTab]
</script>

<!-- Wallet base welcome screen -->
{#if $selectedAccount}
    <div class="flex flex-col w-screen h-screen bg-gray-50 dark:bg-gray-900">
        <div class="px-5 py-6">
            <TopBar />
            <div class="flex justify-center w-full mt-5">
                <TogglableAmountLabel
                    amount={$selectedAccount.balances?.baseCoin?.available}
                    tokenMetadata={BASE_TOKEN[$activeProfile?.networkProtocol]}
                />
            </div>
            {#if features?.wallet?.send?.enabled || features?.wallet?.receive?.enabled}
                <div class="flex flex-row items-center justify-center w-full space-x-2 mt-8">
                    {#if features?.wallet?.send?.enabled}
                        <Button classes="w-full h-10">
                            {localize('actions.send')}
                        </Button>
                    {/if}
                    {#if features?.wallet?.receive?.enabled}
                        <Button classes="w-full h-10" on:click={() => $dashboardRouter.goTo(DashboardRoute.Receive)}>
                            {localize('actions.receive')}
                        </Button>
                    {/if}
                </div>
            {/if}
        </div>
        {#if activeWalletTabComponent}
            <div class="relative flex flex-col flex-auto w-full">
                <TabPane>
                    <svelte:component this={WALLET_TAB_COMPONENT[$activeWalletTab]} />
                </TabPane>
                <TabNavigator />
            </div>
        {/if}
    </div>
{/if}
<!-- Routes -->
{#if $dashboardRoute === DashboardRoute.Receive && features?.wallet?.receive?.enabled}
    <ReceiveDrawer onClose={() => $dashboardRouter.previous()} />
{/if}
