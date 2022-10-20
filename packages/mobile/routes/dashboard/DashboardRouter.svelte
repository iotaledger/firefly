<script lang="typescript">
    import { selectedAccount } from '@core/account'
    import { TabPane } from '../../../mobile/components'
    import features from '../../features/features'
    import { activeWalletTab, WALLET_TAB_COMPONENT } from '../../lib/contexts/wallet'
    import { dashboardRoute, DashboardRoute, dashboardRouter } from '../../lib/core/router'
    import { ReceiveDrawer } from './wallet/drawers'
    import { TabNavigator } from './wallet/tabs'

    $: activeWalletTabComponent = WALLET_TAB_COMPONENT[$activeWalletTab]
</script>

<!-- Wallet base welcome screen -->
{#if $selectedAccount}
    <div class="flex flex-col w-screen h-screen bg-white dark:bg-gray-800">
        <!-- Dummy code -->
        <button on:click={() => $dashboardRouter.goTo(DashboardRoute.Receive)}>Receive</button>
        <!--  -->
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
