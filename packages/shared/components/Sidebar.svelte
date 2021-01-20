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
    button {
        @apply text-gray-500;
        &.active {
            @apply text-blue-500;
        }
    }
</style>

<aside
    class="flex flex-col justify-center items-center bg-white dark:bg-gray-800 h-screen relative w-20 px-5 py-6 border-solid border-r border-gray-100 dark:border-gray-800">
    <Logo classes="mb-10" width="48px" logo="logo-firefly" />
    <nav class="flex flex-grow flex-col justify-between">
        <button class:active={activeTab === Tabs.Wallet} on:click={() => setActiveTab(Tabs.Wallet)}>
            <Icon icon="wallet" />
        </button>
        <button class:active={activeTab === Tabs.Settings} on:click={() => setActiveTab(Tabs.Settings)}>
            <Icon icon="settings" />
        </button>
    </nav>
</aside>
