<script lang="ts">
    import { FontWeight, Icon, Text, NetworkIcon } from '@ui'
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
    import features from '@features/features'
    import { activeProfile } from '@core/profile/stores'

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
        openDrawer({ id: DrawerId.NetworkConfig })
    }
</script>

<top-navigation class:disabled={$platform === PlatformOption.Windows && isPopupVisible}>
    <div class="left-button">
        {#if isBackButtonVisible}
            <button type="button" on:click={onBackClick}>
                <Icon width="18" icon={IconEnum.ArrowLeft} classes="text-gray-800 dark:text-gray-500" />
                <Text overrideColor classes="text-gray-800 dark:text-gray-500">{localize('actions.back')}</Text>
            </button>
        {/if}
    </div>

    <AccountSwitcher />

    <div class="right-button flex justify-end">
        {#if features?.network?.config?.enabled}
            <button class="network-button" on:click={onNetworkClick}>
                <NetworkIcon height={16} width={16} networkId={$activeProfile.network.id} />
                <Text fontWeight={FontWeight.semibold} color="gray-800" darkColor="white"
                    >{$activeProfile.network.name}</Text
                >
            </button>
        {/if}
    </div>
</top-navigation>

<style type="text/scss">
    top-navigation {
        @apply fixed flex flex-row justify-between items-center z-10 top-0 left-18 h-12 px-8 py-1;
        width: calc(100% - 4.5rem);

        &.disabled {
            @apply opacity-50 pointer-events-none;
        }

        button {
            @apply flex items-center gap-2;
            -webkit-app-region: none;
        }

        .network-button {
            @apply bg-white dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-full text-14;
            @apply border border-solid border-white dark:border-gray-800;
            @apply pl-2 pr-3 py-1;
        }

        .left-button,
        .right-button {
            width: 150px;
        }
    }
</style>
