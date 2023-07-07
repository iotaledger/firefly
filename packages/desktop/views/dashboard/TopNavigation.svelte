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
    import { closeDrawer } from '@desktop/auxiliary/drawer'

    let isBackButtonVisible = false

    $: isWindows = $platform === PlatformOption.Windows
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
        closeDrawer()
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

<top-navigation class:disabled={isWindows && isPopupVisible} class:is-windows={isWindows}>
    <div class="left-button" class:large={isWindows}>
        {#if isBackButtonVisible}
            <button type="button" on:click={onBackClick}>
                <Icon width="18" icon={IconEnum.ArrowLeft} classes="text-gray-800 dark:text-gray-500" />
                <Text overrideColor classes="text-gray-800 dark:text-gray-500">{localize('actions.back')}</Text>
            </button>
        {/if}
    </div>

    <AccountSwitcher />

    <div class="right-button flex justify-end" />
</top-navigation>

<style lang="scss">
    top-navigation {
        @apply absolute flex flex-row justify-between items-center z-10 -top-12 left-18 h-12 px-8 py-1;
        width: calc(100% - 4.5rem);

        &.disabled {
            @apply opacity-50 pointer-events-none;
        }

        &.is-windows {
            @apply pr-0;
            width: calc(100% - 15rem);
        }

        button {
            @apply flex items-center gap-2;
            -webkit-app-region: none;
        }

        .right-button {
            width: 10rem;
        }

        .left-button {
            width: 10rem;

            &.large {
                width: 19rem;
            }
        }
    }
</style>
