<script lang="typescript">
    import { localize } from '@core/i18n'
    import {
        DashboardRoute,
        dashboardRoute,
        governanceRoute,
        GovernanceRoute,
        governanceRouter,
        SettingsRoute,
        settingsRoute,
        settingsRouter,
    } from '@core/router'
    import { AccountSwitcher, Icon, Text } from 'shared/components'
    import { Platform } from 'shared/lib/platform'
    import { popupState } from 'shared/lib/popup'
    import { WalletAccount } from 'shared/lib/typings/wallet'
    import { getContext, onMount } from 'svelte'
    import { Readable } from 'svelte/store'
    import { appSettings } from '@lib/appSettings'

    export let onCreateAccount = (..._: any[]): void => {}
    export let classes: string

    const viewableAccounts = getContext<Readable<WalletAccount[]>>('viewableAccounts')

    let showBackButton = false
    let os = ''

    $: $dashboardRoute, $settingsRoute, $governanceRoute, checkToShowBackButton()
    $: showingPopup = $popupState.active && $popupState.type !== 'busy'

    let backButtonText = localize('actions.back')

    function updateBackButtonText(): void {
        backButtonText = localize('actions.back')
    }

    $: $appSettings, updateBackButtonText()

    onMount(async () => {
        os = await Platform.getOS()
    })

    function checkToShowBackButton(): void {
        showBackButton =
            ($dashboardRoute === DashboardRoute.Settings && $settingsRoute !== SettingsRoute.Init) ||
            ($dashboardRoute === DashboardRoute.Governance && $governanceRoute !== GovernanceRoute.Init)
    }

    function handleBackClick(): void {
        switch ($dashboardRoute) {
            case DashboardRoute.Settings:
                $settingsRouter.previous()
                break
            case DashboardRoute.Governance:
                $governanceRouter.previous()
                break
            default:
                break
        }
    }
</script>

<div
    class="fixed top-0 left-20 flex flex-row justify-center items-center py-2 w-full z-10 {os === 'win32' &&
    showingPopup
        ? 'opacity-50 pointer-events-none'
        : ''} {classes}"
>
    {#if showBackButton}
        <button on:click={handleBackClick} class="absolute left-2 cursor-pointer" style="-webkit-app-region: none;">
            <div class="flex items-center space-x-2 ">
                <Icon width="18" icon="arrow-left" classes="text-gray-800 dark:text-gray-500" />
                <Text overrideColor classes="text-gray-800 dark:text-gray-500">{backButtonText}</Text>
            </div>
        </button>
    {/if}
    <AccountSwitcher {onCreateAccount} accounts={$viewableAccounts} />
</div>

<style type="text/scss">
    div {
        width: calc(100% - 14rem);
    }
</style>
