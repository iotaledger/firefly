<script lang="typescript">
    import { selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { BASE_TOKEN } from '@core/network'
    import { activeProfile, hasStrongholdLocked, reflectLockedStronghold, saveActiveProfile } from '@core/profile'
    import { Button, TogglableAmountLabel } from 'shared/components'
    import { TabPane, TopBar } from '../../components'
    import features from '../../features/features'
    import { activeDashboardTab, DASHBOARD_TAB_COMPONENT } from '../../lib/contexts/dashboard'
    import { DashboardRoute, dashboardRouter } from '../../lib/routers'
    import DashboardRouter from './DashboardRouter.svelte'
    import { TabNavigator } from './tabs'

    $: activeDashboardTabComponent = DASHBOARD_TAB_COMPONENT[$activeDashboardTab]

    $: $activeProfile, saveActiveProfile()

    $: $hasStrongholdLocked && reflectLockedStronghold()
</script>

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
            {#if features?.dashboard?.send?.enabled || features?.dashboard?.receive?.enabled}
                <div class="flex flex-row items-center justify-center w-full space-x-2 mt-8">
                    {#if features?.dashboard?.send?.enabled}
                        <Button classes="w-full h-10" onClick={() => $dashboardRouter.goTo(DashboardRoute.Send)}>
                            {localize('actions.send')}
                        </Button>
                    {/if}
                    {#if features?.dashboard?.receive?.enabled}
                        <Button classes="w-full h-10" onClick={() => $dashboardRouter.goTo(DashboardRoute.Receive)}>
                            {localize('actions.receive')}
                        </Button>
                    {/if}
                </div>
            {/if}
        </div>
        {#if activeDashboardTabComponent}
            <div class="relative flex flex-col flex-auto w-full">
                <TabPane>
                    <svelte:component this={DASHBOARD_TAB_COMPONENT[$activeDashboardTab]} />
                </TabPane>
                <TabNavigator />
            </div>
        {/if}
    </div>
{/if}>
<DashboardRouter />
