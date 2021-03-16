<script lang="typescript">
    import { onDestroy } from 'svelte'
    import { Text, Modal } from 'shared/components'
    import { dir } from 'shared/lib/i18n'
    import { networkStatus } from 'shared/lib/networkStatus'
    export let isActive
    export let locale
    let healthStatus = 2
    let healthStatusText = 'networkOperational'
    let messagesPerSecond = 0
    let confirmationRate = 0

    let pos: { [id: string]: string } = { bottom: '24px' }
    dir.subscribe((val) => {
        delete pos[val === 'ltr' ? 'right' : 'left']
        pos[val === 'ltr' ? 'left' : 'right'] = '80px'
    })

    const NETWORK_HEALTH_COLORS = {
        0: 'red',
        1: 'yellow',
        2: 'green',
    }

    const unsubscribe = networkStatus.subscribe((data) => {
        healthStatus = data.health ?? 0
        healthStatusText = healthStatus === 0 ? 'networkDown' : healthStatus === 1 ? 'networkDegraded' : 'networkOperational'
        messagesPerSecond = data.itemsPerSecond ?? 0
        confirmationRate = data.confirmationRate ?? 0
    })

    onDestroy(() => {
        unsubscribe()
    })
</script>

<Modal bind:isActive position={pos}>
    <network-indicator-content class="flex flex-col">
        <Text type="h3" classes="px-7 pt-5">{locale('views.dashboard.network.status')}</Text>
        <div class="px-7 pb-5 text-13 text-{NETWORK_HEALTH_COLORS[healthStatus]}-500">
            {locale(`views.dashboard.network.${healthStatusText}`)}
        </div>
        <hr class="border-t border-solid border-gray-200 dark:border-gray-700" />
        <div class="flex flex-row justify-between px-7 pt-5 pb-2">
            <span class="text-12 text-gray-800 dark:text-white">{locale('views.dashboard.network.messagesPerSecond')}</span>
            <span class="text-12 text-gray-500">{`${Math.round(messagesPerSecond)}`}</span>
        </div>
        <div class="flex flex-row justify-between px-7 pb-5">
            <span class="text-12 text-gray-800 dark:text-white">{locale('views.dashboard.network.confirmationRate')}</span>
            <span class="text-12 text-gray-500">{`${Math.round(confirmationRate)}%`}</span>
        </div>
    </network-indicator-content>
</Modal>
