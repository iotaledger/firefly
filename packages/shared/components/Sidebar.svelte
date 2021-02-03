<script lang="typescript">
    import { onDestroy } from 'svelte'
    import { Logo, Icon } from 'shared/components'
    import NetworkIndicator from './NetworkIndicator.svelte'
    import ProfileModal from './ProfileModal.svelte'
    import { networkStatus } from 'shared/lib/networkStatus'
    import { getActiveProfile } from 'shared/lib/app'
    import { getInitials } from 'shared/lib/helpers'

    export let locale
    export let activeTab

    let showNetwork = false
    let healthStatus = 2
    let showProfile = false
    let profileColor = 'blue' // TODO: each profile has a different color

    const NETWORK_HEALTH_COLORS = {
        0: 'red',
        1: 'yellow',
        2: 'green',
    }

    const profileInitial = getInitials(getActiveProfile().name, 1)

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

    function openSettings() {
        setActiveTab(Tabs.Settings)
    }
</script>

<aside
    class="flex flex-col justify-center items-center bg-white dark:bg-gray-800 h-screen relative w-20 px-5 py-6 border-solid border-r border-gray-100 dark:border-gray-800">
    <Logo classes="mb-10" width="48px" logo="logo-firefly" />
    <nav class="flex flex-grow flex-col items-center justify-between">
        <button class={activeTab === Tabs.Wallet ? 'text-blue-500' : 'text-gray-500'} on:click={() => setActiveTab(Tabs.Wallet)}>
            <Icon icon="wallet" />
        </button>
        <span class="flex flex-col items-center">
            <button class="mb-7 health-status" on:click={() => (showNetwork = true)}>
                <Icon icon="network" classes="text-{NETWORK_HEALTH_COLORS[healthStatus]}-500" />
            </button>
            <button
                class="w-8 h-8 flex items-center justify-center rounded-full bg-{profileColor}-500"
                on:click={() => (showProfile = true)}>
                <span class="text-12 text-center text-white uppercase">{profileInitial}</span>
            </button>
        </span>
    </nav>
    <NetworkIndicator bind:isActive={showNetwork} {locale} />
    <ProfileModal bind:isActive={showProfile} {locale} {openSettings} />
</aside>
