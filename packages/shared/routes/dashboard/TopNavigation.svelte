<script lang="typescript">
    import { localize } from '@core/i18n'
    import { DashboardRoute, dashboardRoute, SettingsRoute, settingsRoute, settingsRouter } from '@core/router'
    import { AccountNavigation, AccountSwitcher, Icon, Text } from 'shared/components'
    import { Platform } from 'shared/lib/platform'
    import { mobile } from 'shared/lib/app'
    import { popupState } from 'shared/lib/popup'
    import { WalletAccount } from 'shared/lib/typings/wallet'
    import { getContext, onMount } from 'svelte'
    import { Readable } from 'svelte/store'

    export let onCreateAccount = (..._: any[]): void => {}
    export let classes: string = ''

    const viewableAccounts = getContext<Readable<WalletAccount[]>>('viewableAccounts')

    let os = ''

    $: showBackButton = isCorrectRoute($settingsRoute)
    $: showingPopup = $popupState.active && $popupState.type !== 'busy'

    onMount(async () => {
        os = await Platform.getOS()
    })

    function isCorrectRoute(_: SettingsRoute): boolean {
        return $settingsRoute !== SettingsRoute.Init
    }

    function handleBackClick(): void {
        switch ($dashboardRoute) {
            case DashboardRoute.Settings:
                $settingsRouter.previous()
                break
            default:
                break
        }
    }
</script>

<div
    class="flex flex-row justify-center items-center w-full z-10 {os === 'win32' && showingPopup
        ? 'opacity-50 pointer-events-none'
        : ''} {classes} {$mobile ? 'top-navigation' : 'fixed top-0 left-20 bg-gray-200 py-2'} "
>
    {#if showBackButton}
        <button on:click={handleBackClick} class="absolute left-2 cursor-pointer" style="-webkit-app-region: none;">
            <div class="flex items-center space-x-2 ">
                <Icon width="18" icon="arrow-left" classes="text-gray-800 dark:text-gray-500" />
                <Text overrideColor classes="text-gray-800 dark:text-gray-500">{localize('actions.back')}</Text>
            </div>
        </button>
    {/if}
    {#if $mobile}
        <AccountNavigation {onCreateAccount} accounts={$viewableAccounts} />
    {:else}
        <AccountSwitcher {onCreateAccount} accounts={$viewableAccounts} />
    {/if}
</div>

<style type="text/scss">
    div {
        width: calc(100% - 14rem);
    }
    .top-navigation {
        padding-top: env(safe-area-inset-top);
    }
</style>
