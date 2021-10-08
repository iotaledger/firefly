<script lang="typescript">
    import { Icon } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { appSettings } from 'shared/lib/appSettings'
    import { deepLinkRequestActive } from 'shared/lib/deepLinking'
    import { isLocaleLoaded } from 'shared/lib/i18n'
    import { accountRoute, dashboardRoute, settingsChildRoute, settingsRoute, walletRoute } from 'shared/lib/router'
    import { AccountRoutes, SettingsRoutes, Tabs, WalletRoutes } from 'shared/lib/typings/routes'
    import { selectedAccountId } from 'shared/lib/wallet'
    import { onDestroy } from 'svelte'
    import { SettingsHome, SettingsViewer } from './views'
    import { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale
    export let handleClose

    $: {
        if ($deepLinkRequestActive && !$appSettings.deepLinking) {
            settingsRoute.set(SettingsRoutes.AdvancedSettings)
            deepLinkRequestActive.set(false)
        }
    }

    function closeSettings() {
        dashboardRoute.set(Tabs.Wallet)
        walletRoute.set(WalletRoutes.Init)
        accountRoute.set(AccountRoutes.Init)
        selectedAccountId.set(null)
    }

    onDestroy(() => {
        // When a new locale is loaded the pages are reloaded
        // so don't reset the router in this case
        if ($isLocaleLoaded) {
            settingsRoute.set(SettingsRoutes.Init)
            settingsChildRoute.set(null)
        }
    })
</script>

<div
    class="relative h-auto w-full px-6 pb-10 md:px-16 md:py-12 md:bg-white md:dark:bg-gray-900 flex flex-1 {$settingsRoute !== SettingsRoutes.Init && 'md:pt-20'} ">
    {#if !$mobile}
        <button on:click={handleClose || closeSettings} class="absolute top-8 right-8">
            <Icon icon="close" classes="text-gray-800 dark:text-white" />
        </button>
    {/if}
    {#if $settingsRoute === SettingsRoutes.Init}
        <SettingsHome {locale} />
    {:else}
        <SettingsViewer {locale} />
    {/if}
</div>
