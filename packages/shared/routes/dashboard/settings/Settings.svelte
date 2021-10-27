<script lang="typescript">
    import { Drawer, Icon, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { appSettings } from 'shared/lib/appSettings'
    import { deepLinkRequestActive } from 'shared/lib/deepLinking'
    import { getInitials } from 'shared/lib/helpers'
    import { isLocaleLoaded } from 'shared/lib/i18n'
    import { activeProfile } from 'shared/lib/profile'
    import { accountRoute, dashboardRoute, settingsChildRoute, settingsRoute, walletRoute } from 'shared/lib/router'
    import type { Locale } from 'shared/lib/typings/i18n'
    import { AccountRoutes, SettingsRoutes, Tabs, WalletRoutes } from 'shared/lib/typings/routes'
    import { selectedAccountId } from 'shared/lib/wallet'
    import { onDestroy } from 'svelte'
    import { get } from 'svelte/store'
    import { SettingsHome, SettingsViewer } from './views'

    export let locale: Locale
    export let handleClose

    let drawer: Drawer

    const profileColor = 'blue' // TODO: each profile has a different color

    $: {
        if ($deepLinkRequestActive && !$appSettings.deepLinking) {
            settingsRoute.set(SettingsRoutes.AdvancedSettings)
            deepLinkRequestActive.set(false)
        }
    }

    $: if ($mobile && $dashboardRoute === Tabs.Settings) {
        drawer?.open()
    } else if ($mobile && $dashboardRoute === Tabs.Wallet) {
        drawer?.close()
    }

    function handleBackClick() {
        if ($settingsRoute === SettingsRoutes.Init) {
            closeSettings()
        } else {
            settingsRoute.set(SettingsRoutes.Init)
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

{#if $mobile}
    <Drawer
        fromRight={true}
        dimLength={0}
        opened={$dashboardRoute === Tabs.Settings}
        fullScreen
        classes="flex"
        bind:this={drawer}>
        <div class="flex w-full h-full relative z-0 pt-20">
            <div
                class="fixed top-0 cursor-pointer w-full px-8 py-3 flex items-centers justify-center bg-white dark:bg-gray-800"
                on:click={handleBackClick}>
                <Icon icon="arrow-left" classes="absolute left-6 text-gray-500 text-blue-500" />
                <Text type="h4" classes="text-center">
                    {locale($settingsRoute === SettingsRoutes.Init ? 'general.yourWallets' : `views.settings.${$settingsChildRoute}.title`)}
                </Text>
            </div>
            <div class="flex-1 overflow-y-auto px-6">
                {#if $settingsRoute === SettingsRoutes.Init}
                    <!-- TODO: add real profile data -->
                    <div class="flex flex-row items-center space-x-6 mb-7 w-full">
                        <div
                            class="w-16 h-16 flex items-center justify-center rounded-full bg-{profileColor}-500 leading-100">
                            <span
                                class="text-20 text-center text-white uppercase font-semibold">{getInitials(get(activeProfile)?.name, 1) || 'A'}</span>
                        </div>
                        <Text type="h4">John Doe</Text>
                    </div>
                {/if}
                {#if $settingsRoute === SettingsRoutes.Init}
                    <SettingsHome {locale} />
                {:else}
                    <SettingsViewer {locale} />
                {/if}
            </div>
        </div>
    </Drawer>
{:else}
    <div
        class="relative h-auto w-full px-6 pb-10 md:px-16 md:py-12 md:bg-white md:dark:bg-gray-900 flex flex-1 {$settingsRoute !== SettingsRoutes.Init && 'md:pt-20'} ">
        <button on:click={handleClose || closeSettings} class="absolute top-8 right-8">
            <Icon icon="close" classes="text-gray-800 dark:text-white" />
        </button>
        {#if $settingsRoute === SettingsRoutes.Init}
            <SettingsHome {locale} />
        {:else}
            <SettingsViewer {locale} />
        {/if}
    </div>
{/if}
