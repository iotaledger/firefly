<script lang="typescript">
    import { onMount } from 'svelte'
    import { get } from 'svelte/store';
    import { Sidebar } from 'shared/components'
    import { Wallet, Settings } from 'shared/routes'
    import { parseDeepLink } from 'shared/lib/utils'
    import { sendParams } from 'shared/lib/app'
    import { deepLinkRequestActive } from 'shared/lib/deepLinking'
    import { deepLinking } from 'shared/lib/settings'


    export let locale
    export let mobile
    const tabs = {
        wallet: Wallet,
        settings: Settings,
    }
    enum Tabs {
        Wallet = 'wallet',
        Settings = 'settings',
    }

    const DeepLinkManager = window['Electron']['DeepLinkManager']

    let activeTab = Tabs.Wallet

    onMount(() => { 
        DeepLinkManager.requestDeepLink()
        window['Electron'].onEvent('deepLink-params', (data) => handleDeepLinkRequest(data))
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
            if (activeTab !== tab) {
                activeTab = tab
            }
        }

        if (!get(deepLinking)) {
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
    <div class="flex flex-row w-full h-full">
        <Sidebar bind:activeTab {locale} />
        <!-- Dashboard Pane -->
        <svelte:component this={tabs[activeTab]} {locale} />
    </div>
{/if}
