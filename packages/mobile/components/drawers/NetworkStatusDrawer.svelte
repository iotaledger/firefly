<script lang="ts">
    import { KeyValueBox } from '@ui'

    import { localize } from '@core/i18n'
    import { NetworkHealth, networkStatus, NETWORK_STATUS_DESCRIPTION, nodeInfo } from '@core/network'

    $: description = $networkStatus.description ?? NETWORK_STATUS_DESCRIPTION[NetworkHealth.Disconnected]
    $: networkStatistics = {
        messagesPerSecond: Math.round($networkStatus.messagesPerSecond ?? 0),
        referencedRate: Math.round($networkStatus.referencedRate ?? 0) + '%',
    }
</script>

<div class="flex flex-col space-y-2">
    <KeyValueBox keyText={localize('general.network')} valueText={$nodeInfo?.protocol?.networkName} />
    <KeyValueBox
        keyText={localize('views.settings.networkStatus.title')}
        valueText={localize(`views.dashboard.network.${description}`)}
    />
    <KeyValueBox
        keyText={localize('popups.node.info.general.latestMilestone')}
        valueText={$networkStatus?.currentMilestone?.toString() ?? '-'}
    />
    {#each Object.keys(networkStatistics) as networkStatisticKey}
        <KeyValueBox
            keyText={localize(`views.dashboard.network.${networkStatisticKey}`)}
            valueText={networkStatistics[networkStatisticKey]}
        />
    {/each}
</div>
