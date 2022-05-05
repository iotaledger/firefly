<script lang="typescript">
    import { HR, Modal, Text } from 'shared/components'
    import { NETWORK_HEALTH_COLORS, networkStatus } from 'shared/lib/networkStatus'
    import { activeProfile } from 'shared/lib/profile'
    import { localize } from '@core/i18n'
    import { NetworkStatusHealthText } from 'shared/lib/typings/network'

    export let modal: Modal

    $: healthStatus = $networkStatus.health ?? 0
    $: healthStatusText = $networkStatus.healthText ?? NetworkStatusHealthText.Down
    $: messagesPerSecond = $networkStatus.messagesPerSecond ?? 0
    $: referencedRate = $networkStatus.referencedRate ?? 0
</script>

<Modal bind:this={modal} position={{ left: '80px', top: '25px' }}>
    <network-indicator-content class="flex flex-col">
        {#if $activeProfile.isDeveloperProfile}
            <Text type="h3" classes="px-7 pt-5">{$activeProfile.settings.networkConfig.network.name}</Text>
        {/if}
        <div class="px-7 pb-5 text-13 text-{NETWORK_HEALTH_COLORS[healthStatus]}-500">
            {localize(`views.dashboard.network.${healthStatusText}`)}
        </div>
        {#if !$activeProfile?.settings.hideNetworkStatistics && healthStatus !== 0}
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
