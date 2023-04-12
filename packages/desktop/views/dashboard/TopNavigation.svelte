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
    import { isNetworkSideDrawerOpen } from '@core/network'

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
        $isNetworkSideDrawerOpen = true
    }
</script>

<top-navigation class:disabled={$platform === PlatformOption.Windows && isPopupVisible}>
    {#if isBackButtonVisible}
        <button type="button" class="back-button" on:click={onBackClick}>
            <Icon width="18" icon={IconEnum.ArrowLeft} classes="text-gray-800 dark:text-gray-500" />
            <Text overrideColor classes="text-gray-800 dark:text-gray-500">{localize('actions.back')}</Text>
        </button>
    {:else}
        <div />
    {/if}

    <AccountSwitcher />

    <button type="button" class="network-button" on:click={onNetworkClick}>
        <Icon width="22" icon={IconEnum.Network} primaryColor="white" />
    </button>
</top-navigation>

<style type="text/scss">
    top-navigation {
        @apply fixed flex flex-row justify-between items-center z-10 top-0 py-2 px-8;
        width: calc(100% - 4.5rem);
        height: 4rem;

        &.disabled {
            @apply opacity-50 pointer-events-none;
        }

        .back-button {
            @apply flex items-center left-2 gap-2 cursor-pointer;
            -webkit-app-region: none;
        }

        .network-button {
            @apply flex items-center left-2 gap-2 cursor-pointer px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg;
            -webkit-app-region: none;
            box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.08);
        }
    }
</style>
