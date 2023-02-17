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

    function handleBackClick(): void {
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
</script>

<top-navigation class:disabled={$platform === PlatformOption.Windows && isPopupVisible}>
    {#if isBackButtonVisible}
        <button type="button" on:click={handleBackClick}>
            <Icon width="18" icon={IconEnum.ArrowLeft} classes="text-gray-800 dark:text-gray-500" />
            <Text overrideColor classes="text-gray-800 dark:text-gray-500">{localize('actions.back')}</Text>
        </button>
    {/if}
    <AccountSwitcher />
</top-navigation>

<style type="text/scss">
    top-navigation {
        @apply fixed flex flex-row justify-center items-center z-10 top-0 left-20;
        @apply py-2 w-full;
        width: calc(100% - 14rem);

        &.disabled {
            @apply opacity-50 pointer-events-none;
        }

        button {
            @apply absolute flex items-center left-2 gap-2 cursor-pointer;
            -webkit-app-region: none;
        }
    }
</style>
