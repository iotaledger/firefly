<script lang="typescript">
    import { HR, Modal, Text } from 'shared/components'
    import { networkStatus } from 'shared/lib/networkStatus'
    import { activeProfile } from 'shared/lib/profile'
    import { onDestroy } from 'svelte'
    import { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale

    export let isActive
    let healthStatus = 2
    let healthStatusText = 'networkOperational'
    let messagesPerSecond = 0
    let referencedRate = 0

    const NETWORK_HEALTH_COLORS = {
        0: 'red',
        1: 'yellow',
        2: 'green',
    }

    const unsubscribe = networkStatus.subscribe((data) => {
        healthStatus = data.health ?? 0
        healthStatusText = healthStatus === 0 ? 'networkDown' : healthStatus === 1 ? 'networkDegraded' : 'networkOperational'
        messagesPerSecond = data.messagesPerSecond ?? 0
        referencedRate = data.referencedRate ?? 0
    })

    onDestroy(() => {
        unsubscribe()
    })
</script>

<Modal bind:isActive position={{ left: '80px', bottom: '25px' }}>
    <network-indicator-content class="flex flex-col">
        {#if $activeProfile.isDeveloperProfile}
            <Text type="h3" classes="px-7 pt-5">{locale('general.network')}</Text>
            <Text type="p" highlighted classes="px-7">{$activeProfile.settings.networkConfig.network.name}</Text>
        {/if}
        <Text type="h3" classes="px-7 pt-{$activeProfile.isDeveloperProfile ? '2' : '5'}">{locale('views.dashboard.network.status')}</Text>
        <div class="px-7 pb-5 text-13 text-{NETWORK_HEALTH_COLORS[healthStatus]}-500">
            {locale(`views.dashboard.network.${healthStatusText}`)}
        </div>
        {#if !$activeProfile?.settings.hideNetworkStatistics}
            <HR />
            <div class="flex flex-row justify-between px-7 pt-5 pb-2">
                <span class="text-12 text-gray-800 dark:text-white">{locale('views.dashboard.network.messagesPerSecond')}</span>
                <span class="text-12 text-gray-500">{`${Math.round(messagesPerSecond)}`}</span>
            </div>
            <div class="flex flex-row justify-between px-7 pb-5">
                <span class="text-12 text-gray-800 dark:text-white">{locale('views.dashboard.network.referencedRate')}</span>
                <span class="text-12 text-gray-500">{`${Math.round(referencedRate)}%`}</span>
            </div>
        {/if}
    </network-indicator-content>
</Modal>
