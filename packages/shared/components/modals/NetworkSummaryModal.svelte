<script lang="typescript">
    import { HR, Modal, Text } from 'shared/components'
    import {
        NETWORK_HEALTH_COLORS,
        networkStatus,
        NetworkStatusDescription,
        NetworkHealth,
        nodeInfo,
    } from '@core/network'
    import { activeProfile } from '@core/profile'
    import { localize } from '@core/i18n'

    export let modal: Modal = undefined

    $: health = $networkStatus.health ?? 0
    $: description = $networkStatus.description ?? NetworkStatusDescription[NetworkHealth.Disconnected]
    $: messagesPerSecond = $networkStatus.messagesPerSecond ?? 0
    $: referencedRate = $networkStatus.referencedRate ?? 0
</script>

<Modal bind:this={modal} position={{ left: '80px', top: '25px' }}>
    <network-indicator-content class="flex flex-col">
        {#if $activeProfile?.isDeveloperProfile}
            <Text type="h3" classes="px-7 pt-5">{$nodeInfo?.protocol?.networkName}</Text>
        {/if}
        <div class="px-7 pb-5 text-13 text-{NETWORK_HEALTH_COLORS[health]}-500">
            {localize(`views.dashboard.network.${description}`)}
        </div>
        {#if !$activeProfile?.settings.hideNetworkStatistics && health !== 0}
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
