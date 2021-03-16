<script lang="typescript">
    import { Icon } from 'shared/components'
    import { deepLinkRequestActive } from 'shared/lib/deepLinking'
    import { activeProfile } from 'shared/lib/profile'
    import { accountRoute, dashboardRoute, settingsRoute, walletRoute } from 'shared/lib/router'
    import { AccountRoutes, SettingsRoutes, WalletRoutes, Tabs } from 'shared/lib/typings/routes'
    import { selectedAccountId } from 'shared/lib/wallet'
    import { createEventDispatcher, onDestroy } from 'svelte'
    import { get } from 'svelte/store'
    import { SettingsHome, SettingsViewer } from './views'

    export let locale
    export let mobile

    const dispatch = createEventDispatcher()

    function navigate(params) {
        dispatch('next', params)
    }

    $: {
        if ($deepLinkRequestActive && !get(activeProfile)?.settings.deepLinking) {
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
        settingsRoute.set(SettingsRoutes.Init)
    })
</script>

<div class="relative w-full h-full px-16 py-12 flex flex-1 bg-white {$settingsRoute !== SettingsRoutes.Init && 'pt-20'} ">
    <button on:click={closeSettings} class="absolute top-8 right-8">
        <Icon icon="close" classes="text-gray-800 dark:text-white" />
    </button>
    {#if $settingsRoute === SettingsRoutes.Init}
        <SettingsHome {mobile} {locale} />
    {:else}
        <SettingsViewer {mobile} {locale} {navigate} />
    {/if}
</div>
