<script lang="typescript">
    import { Sidebar } from 'shared/components'
    import { Wallet, Settings } from 'shared/routes'

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

    let activeTab = Tabs.Wallet
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <div class="flex flex-row w-full h-full">
        <Sidebar bind:activeTab />
        <!-- Dashboard Pane -->
        <svelte:component this={tabs[activeTab]} {locale} />
    </div>
{/if}
