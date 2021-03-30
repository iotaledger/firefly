<script lang="typescript">
    import { Idle, Sidebar } from 'shared/components'
    import { logout, sendParams } from 'shared/lib/app'
    import { appSettings } from 'shared/lib/appSettings'
    import { deepLinkRequestActive } from 'shared/lib/deepLinking'
    import { Electron } from 'shared/lib/electron'
    import { showSystemNotification } from 'shared/lib/notifications'
    import { dashboardRoute, routerNext } from 'shared/lib/router'
    import { Tabs } from 'shared/lib/typings/routes'
    import { parseWalletDeepLink } from 'shared/lib/utils'
    import { api, STRONGHOLD_PASSWORD_CLEAR_INTERVAL_SECS, wallet } from 'shared/lib/wallet'
    import { Settings, Wallet } from 'shared/routes'
    import { onDestroy, onMount } from 'svelte'
    import { get } from 'svelte/store'

    const { accountsLoaded, accounts } = $wallet

    export let locale
    export let mobile

    const tabs = {
        wallet: Wallet,
        settings: Settings,
    }

    const accountsSubscription = accountsLoaded.subscribe(() => {
        Electron.DeepLinkManager.requestDeepLink()
        Electron.onEvent('deep-link-params', (data) => handleDeepLinkRequest(data))
    })

    onMount(() => {
        api.setStrongholdPasswordClearInterval({ secs: STRONGHOLD_PASSWORD_CLEAR_INTERVAL_SECS, nanos: 0 })

        Electron.onEvent('menu-logout', () => {
            logout()
        })
    })

    onDestroy(accountsSubscription)

    /**
     * Handles deep link request
     * If deep linking is enabled, fill send input parameters
     * If deep linking is disabled, direct user to settings
     */
    const handleDeepLinkRequest = (data) => {
        const _redirect = (tab) => {
            deepLinkRequestActive.set(true)
            if (get(dashboardRoute) !== tab) {
                dashboardRoute.set(tab)
            }
        }

        if (!$appSettings.deepLinking) {
            _redirect(Tabs.Settings)
            showSystemNotification({ type: 'info', message: locale('notifications.deepLinkingIsNotEnabled') })
        } else {
            if ($accounts && $accounts.length > 0) {
                let addressPrefix = $accounts[0].depositAddress.split('1')[0]

                const parsedData = parseWalletDeepLink(addressPrefix, data)

                if (parsedData) {
                    _redirect(Tabs.Wallet)
                    sendParams.set({
                        ...parsedData,
                        isInternal: false,
                    })
                } else {
                    showSystemNotification({ type: 'error', message: locale('notifications.deepLinkingInvalidFormat') })
                }
            }
        }
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <Idle />
    <div class="flex flex-row w-full h-full">
        <Sidebar {locale} />
        <!-- Dashboard Pane -->
        <svelte:component this={tabs[$dashboardRoute]} {locale} on:next={routerNext} />
    </div>
{/if}
