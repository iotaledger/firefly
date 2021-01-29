<script lang="typescript">
    import { onDestroy } from 'svelte'
    import { Logo, Icon } from 'shared/components'
    import NetworkIndicator from './NetworkIndicator.svelte';
    import { networkStatus } from 'shared/lib/networkStatus'

    export let locale
    export let activeTab
    let showNetwork = false;
    let healthStatus = 2

    const unsubscribe = networkStatus.subscribe((data) => {
        healthStatus = data.health ?? 0
    })

    onDestroy(() => {
        unsubscribe()
    })

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

    .health-status {
            &.health-2 {
                color: var(--green-ff-color);
            }
            &.health-1 {
                color: var(--yellow-ff-color);
            }
            &.health-0 {
                color: var(--red-ff-color);
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
        <span>
            <button class={`mb-10 health-status health-${healthStatus}`} on:click={() => showNetwork = true}>
                <Icon icon="network" />
            </button>
            <button class:active={activeTab === Tabs.Settings} on:click={() => setActiveTab(Tabs.Settings)}>
                <Icon icon="settings" />
            </button>
        </span>
    </nav>
    <NetworkIndicator bind:isActive={showNetwork} {locale} />
</aside>
