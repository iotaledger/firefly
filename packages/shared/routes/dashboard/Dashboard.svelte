<script lang="typescript">
    import { Idle, Sidebar } from 'shared/components'
    import { logout, sendParams } from 'shared/lib/app'
    import { appSettings } from 'shared/lib/appSettings'
    import { deepLinkRequestActive } from 'shared/lib/deepLinking'
    import { Electron } from 'shared/lib/electron'
    import { showSystemNotification } from 'shared/lib/notifications'
    import { accountRoute, dashboardRoute, routerNext, walletRoute } from 'shared/lib/router'
    import { AccountRoutes, Tabs, WalletRoutes } from 'shared/lib/typings/routes'
    import { parseDeepLink } from 'shared/lib/utils'
    import { api, selectedAccountId, STRONGHOLD_PASSWORD_CLEAR_INTERVAL_SECS, wallet } from 'shared/lib/wallet'
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

        Electron.onEvent('notification-activated', (contextData) => {
            if (contextData) {
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

                const parsedData = parseDeepLink(addressPrefix, data)

                if (parsedData && parsedData.context === 'wallet' && parsedData.operation === 'send') {
                    _redirect(Tabs.Wallet)
                    sendParams.set({
                        ...parsedData.params,
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
