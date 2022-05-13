<script lang="typescript">
    import { HR, Modal, Text } from 'shared/components'
    import { NETWORK_HEALTH_COLORS, networkStatus } from 'shared/lib/networkStatus'
    import { activeProfile } from 'shared/lib/profile'
    import { onDestroy } from 'svelte'
    import { NetworkStatusHealthText } from 'shared/lib/typings/network'
    import { localize } from '@core/i18n'

    export let modal: Modal

    let healthStatus = 2
    let healthStatusText = 'networkOperational'
    let messagesPerSecond = 0
    let referencedRate = 0

    const unsubscribe = networkStatus.subscribe((data) => {
        healthStatus = data.health ?? 0
        healthStatusText = data.healthText ?? NetworkStatusHealthText.Down
        messagesPerSecond = data.messagesPerSecond ?? 0
        referencedRate = data.referencedRate ?? 0
    })

    onDestroy(() => {
        unsubscribe()
    })
</script>

<Modal bind:this={modal} position={{ left: '80px', bottom: '25px' }}>
    <network-indicator-content class="flex flex-col">
        {#if $activeProfile.isDeveloperProfile}
            <Text type="h3" classes="px-7 pt-5">{localize('general.network')}</Text>
            <Text type="p" highlighted classes="px-7">{$activeProfile.settings.networkConfig.network.name}</Text>
        {/if}
        <Text type="h3" classes="px-7 pt-{$activeProfile.isDeveloperProfile ? '2' : '5'}"
            >{localize('views.dashboard.network.status')}</Text
        >
        <div class="px-7 pb-5 text-13 text-{NETWORK_HEALTH_COLORS[healthStatus]}-500">
            {localize(`views.dashboard.network.${healthStatusText}`)}
        </div>
        {#if !$activeProfile?.settings.hideNetworkStatistics}
            <HR />
            <div class="flex flex-row justify-between px-7 pt-5 pb-2">
                <span class="text-12 text-gray-800 dark:text-white"
                    >{localize('views.dashboard.network.messagesPerSecond')}</span
                >
                <span class="text-12 text-gray-500">{`${Math.round(messagesPerSecond)}`}</span>
            </div>
            <div class="flex flex-row justify-between px-7 pb-5">
                <span class="text-12 text-gray-800 dark:text-white"
                    >{localize('views.dashboard.network.referencedRate')}</span
                >
                <span class="text-12 text-gray-500">{`${Math.round(referencedRate)}%`}</span>
            </div>
        {/if}
    </network-indicator-content>
</Modal>
