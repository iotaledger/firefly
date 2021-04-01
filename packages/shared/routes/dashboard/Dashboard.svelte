<script lang="typescript">
    import { Idle, Sidebar } from 'shared/components'
    import { logout, sendParams } from 'shared/lib/app'
    import { appSettings } from 'shared/lib/appSettings'
    import { deepLinkRequestActive } from 'shared/lib/deepLinking'
    import { Electron } from 'shared/lib/electron'
    import { accountRoute, dashboardRoute, routerNext, walletRoute } from 'shared/lib/router'
    import { AccountRoutes, Tabs, WalletRoutes } from 'shared/lib/typings/routes'
    import { parseDeepLink } from 'shared/lib/utils'
    import { api, selectedAccountId, STRONGHOLD_PASSWORD_CLEAR_INTERVAL_SECS } from 'shared/lib/wallet'
    import { Settings, Wallet } from 'shared/routes'
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'

    export let locale
    export let mobile

    const tabs = {
        wallet: Wallet,
        settings: Settings,
    }

    onMount(() => {
        api.setStrongholdPasswordClearInterval({ secs: STRONGHOLD_PASSWORD_CLEAR_INTERVAL_SECS, nanos: 0 })
        Electron.DeepLinkManager.requestDeepLink()
        Electron.onEvent('deep-link-params', (data) => handleDeepLinkRequest(data))

        Electron.onEvent('menu-logout', () => {
            logout()
        })

        Electron.onEvent('notification-activated', (contextData) => {
            if (contextData && contextData.type) {
                if (
                    (contextData.type === 'confirmed' || contextData.type === 'failed' || contextData.type === 'valueTx') &&
                    contextData.accountId
                ) {
                    selectedAccountId.set(contextData.accountId)
                    if (get(dashboardRoute) !== Tabs.Wallet) {
                        dashboardRoute.set(Tabs.Wallet)
                    }
                    walletRoute.set(WalletRoutes.Account)
                    accountRoute.set(AccountRoutes.Init)
                }
            }
            console.log('Noticication Dasta', contextData)
        })
    })

    /**
     * Handles deep link request
     * If deep linking is enabled, fill send input parameters
     * If deep linking is disabled, direct user to settings
     */
    const handleDeepLinkRequest = (data) => {
        const parsedData = parseDeepLink(data)
        const _redirect = (tab) => {
            deepLinkRequestActive.set(true)
            if (get(dashboardRoute) !== tab) {
                dashboardRoute.set(tab)
            }
        }

        if (!$appSettings.deepLinking) {
            _redirect(Tabs.Settings)
            // TODO: Add alert system
            console.log('deep linking not enabled')
        } else if (parsedData) {
            _redirect(Tabs.Wallet)
            sendParams.set(parsedData)
        } else {
            console.log('error parsing')
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
