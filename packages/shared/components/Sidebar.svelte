<script lang="typescript">
    import { Logo, Icon } from 'shared/components'

    export let activeTab

    enum Tabs {
        Wallet = 'wallet',
        Settings = 'settings',
    }

    function setActiveTab(tab: Tabs) {
        activeTab = tab
    }
</script>

<style type="text/scss">
    :global(aside svg path) {
        fill: var(--text-secondary-color); // TODO: tailwindify
    }
</style>

<aside class="flex flex-col justify-center items-center bg-white h-screen relative w-20 px-5 py-6 border-solid border-r border-gray-100">
    <Logo classes="mb-10" width="48px" logo="logo-firefly" />
    <nav class="flex flex-grow flex-col justify-between">
        <div>
            <button on:click={() => setActiveTab(Tabs.Wallet)}><Icon classes='text-gray-800' icon="wallet" /></button>
        </div>
        <div>
            <button on:click={() => setActiveTab(Tabs.Settings)}><Icon classes='text-gray-800' icon="settings" /></button>
        </div>
    </nav>
</aside>
