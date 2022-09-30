<script lang="typescript">
    import { HR, Modal, Text } from 'shared/components'
    import {
        NETWORK_HEALTH_COLORS,
        networkStatus,
        NETWORK_STATUS_DESCRIPTION,
        NetworkHealth,
        nodeInfo,
    } from '@core/network'
    import { activeProfile } from '@core/profile'
    import { localize } from '@core/i18n'
    import { TextType } from 'shared/components/Text.svelte'

    export let modal: Modal

    let health: NetworkHealth

    $: health = $networkStatus.health ?? NetworkHealth.Down
    $: healthColor = `${NETWORK_HEALTH_COLORS[health]}-500`
    $: description = $networkStatus.description ?? NETWORK_STATUS_DESCRIPTION[NetworkHealth.Disconnected]
    $: networkStatistics = {
        messagesPerSecond: Math.round($networkStatus.messagesPerSecond ?? 0),
        referencedRate: Math.round($networkStatus.referencedRate ?? 0) + '%',
    }
</script>

<Modal bind:this={modal} position={{ left: '80px', top: '25px' }}>
    <network-indicator-content class="flex flex-col">
        <div class="py-5">
            {#if $activeProfile?.isDeveloperProfile}
                <Text type={TextType.h3} classes="px-7">{$nodeInfo?.protocol?.networkName}</Text>
            {/if}
            <Text classes="px-7" color={healthColor} darkColor={healthColor}>
                {localize(`views.dashboard.network.${description}`)}
            </Text>
        </div>
        {#if !$activeProfile?.settings.hideNetworkStatistics && health !== NetworkHealth.Down}
            <HR />
            <network-statistics-container class="py-5 space-y-2">
                {#each Object.keys(networkStatistics) as networkStatisticKey}
                    <network-statistic class="flex flex-row justify-between px-7">
                        <Text smaller>
                            {localize(`views.dashboard.network.${networkStatisticKey}`)}
                        </Text>
                        <Text smaller color="gray-500" darkColor="gray-500">
                            {networkStatistics[networkStatisticKey]}
                        </Text>
                    </network-statistic>
                {/each}
            </network-statistics-container>
        {/if}
    </network-indicator-content>
</Modal>
