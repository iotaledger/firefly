<script lang="ts">
    import { KeyValueBox } from '@ui'

    import { localize } from '@core/i18n'
    import { NetworkHealth, networkStatus, nodeInfo } from '@core/network'

    $: networkStatistics = {
        messagesPerSecond: Math.round($networkStatus.messagesPerSecond ?? 0),
        referencedRate: Math.round($networkStatus.referencedRate ?? 0) + '%',
    }
</script>

{#if $nodeInfo}
    <network-status-drawer class="flex flex-col space-y-2">
        <KeyValueBox keyText={localize('general.network')} valueText={$nodeInfo.protocol.networkName} />
        <KeyValueBox
            keyText={localize('views.settings.networkStatus.title')}
            valueText={localize(`views.dashboard.network.${$networkStatus.health ?? NetworkHealth.Disconnected}`)}
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
    </network-status-drawer>
{/if}
