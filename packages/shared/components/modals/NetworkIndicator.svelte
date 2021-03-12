<script lang="typescript">
    import { onDestroy } from 'svelte'
    import { Text, Modal, HR } from 'shared/components'
    import { networkStatus } from 'shared/lib/networkStatus'
    export let isActive
    export let locale
    let healthStatus = 2
    let healthStatusText = 'network_operational'
    let messagesPerSecond = 0
    let confirmationRate = 0

    const NETWORK_HEALTH_COLORS = {
        0: 'red',
        1: 'yellow',
        2: 'green',
    }

    const unsubscribe = networkStatus.subscribe((data) => {
        healthStatus = data.health ?? 0
        healthStatusText = healthStatus === 0 ? 'network_down' : healthStatus === 1 ? 'network_degraded' : 'network_operational'
        messagesPerSecond = data.itemsPerSecond ?? 0
        confirmationRate = data.confirmationRate ?? 0
    })

    onDestroy(() => {
        unsubscribe()
    })
</script>

<Modal bind:isActive position={{ left: '80px', bottom: '25px' }}>
    <network-indicator-content class="flex flex-col">
        <Text type="h3" classes="px-7 pt-5">{locale('views.dashboard.network.status')}</Text>
        <div class="px-7 pb-5 text-13 text-{NETWORK_HEALTH_COLORS[healthStatus]}-500">
            {locale(`views.dashboard.network.${healthStatusText}`)}
        </div>
        <HR />
        <div class="flex flex-row justify-between px-7 pt-5 pb-2">
            <span class="text-12 text-gray-800 dark:text-white">{locale('views.dashboard.network.messages_per_second')}</span>
            <span class="text-12 text-gray-500">{`${Math.round(messagesPerSecond)}`}</span>
        </div>
        <div class="flex flex-row justify-between px-7 pb-5">
            <span class="text-12 text-gray-800 dark:text-white">{locale('views.dashboard.network.confirmation_rate')}</span>
            <span class="text-12 text-gray-500">{`${Math.round(confirmationRate)}%`}</span>
        </div>
    </network-indicator-content>
</Modal>
