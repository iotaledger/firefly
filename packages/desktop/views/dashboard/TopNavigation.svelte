<script lang="ts">
    import { Icon, Text } from '@ui'
    import { AccountSwitcher } from '@components'
    import { PlatformOption } from '@core/app'
    import { platform } from '@core/app/stores'
    import { localize } from '@core/i18n'
    import {
        collectiblesRoute,
        CollectiblesRoute,
        collectiblesRouter,
        dashboardRoute,
        DashboardRoute,
        governanceRoute,
        GovernanceRoute,
        governanceRouter,
        settingsRoute,
        SettingsRoute,
        settingsRouter,
    } from '@core/router'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { popupState } from '@auxiliary/popup'
    import { DrawerId, openDrawer } from '@desktop/auxilary/drawer'

    let isBackButtonVisible = false

    $: {
        if ($settingsRoute || $collectiblesRoute || $governanceRoute) {
            isBackButtonVisible = isCorrectRoute()
        }
    }
    $: isPopupVisible = $popupState?.active && $popupState?.id !== 'busy'

    function isCorrectRoute(): boolean {
        switch ($dashboardRoute) {
            case DashboardRoute.Settings:
                return $settingsRoute !== SettingsRoute.Init
            case DashboardRoute.Collectibles:
                return $collectiblesRoute !== CollectiblesRoute.Gallery
            case DashboardRoute.Governance:
                return $governanceRoute !== GovernanceRoute.Proposals
            default:
                break
        }
    }

    function onBackClick(): void {
        switch ($dashboardRoute) {
            case DashboardRoute.Settings:
                $settingsRouter.previous()
                break
            case DashboardRoute.Collectibles:
                $collectiblesRouter.previous()
                break
            case DashboardRoute.Governance:
                $governanceRouter.previous()
                break
            default:
                break
        }
    }

    function onNetworkClick(): void {
        openDrawer({ id: DrawerId.Network })
    }
</script>

<top-navigation class:disabled={$platform === PlatformOption.Windows && isPopupVisible}>
    {#if isBackButtonVisible}
        <button type="button" on:click={onBackClick}>
            <Icon width="18" icon={IconEnum.ArrowLeft} classes="text-gray-800 dark:text-gray-500" />
            <Text overrideColor classes="text-gray-800 dark:text-gray-500">{localize('actions.back')}</Text>
        </button>
    {:else}
        <div />
    {/if}

    <AccountSwitcher />

    <button class="bg-white rounded-xl text-14 px-2" on:click={onNetworkClick}>Shimmer</button>
</top-navigation>

<style type="text/scss">
    top-navigation {
        @apply fixed flex flex-row justify-between items-center z-10 top-0 left-18 h-9 px-8;
        @apply py-1;
        width: calc(100% - 4.5rem);

        &.disabled {
            @apply opacity-50 pointer-events-none;
        }
    }
</style>
