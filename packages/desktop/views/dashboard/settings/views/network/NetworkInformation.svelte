<script lang="ts">
    import { localize } from '@core/i18n'
    import { NetworkHealth, networkStatus, NETWORK_HEALTH_COLORS, nodeInfo } from '@core/network'
    import { NetworkSettingsRoute } from '@core/router'
    import { Text } from 'shared/components'
    import SettingsSection from '../SettingsSection.svelte'

    $: health = $networkStatus.health ?? NetworkHealth.Disconnected
</script>

{#if $nodeInfo}
    <SettingsSection setting={NetworkSettingsRoute.NetworkInformation}>
        <div class="flex flex-row justify-between">
            <div class="flex flex-col space-y-1">
                <Text secondary>
                    {localize('views.settings.networkInformation.connectedTo')}:
                </Text>
                <Text highlighted>{$nodeInfo?.protocolParameters?.[0]?.parameters?.networkName}</Text>
            </div>
            <div class="flex flex-col space-y-1">
                <Text secondary>{localize('views.dashboard.network.status')}:</Text>
                <Text color="{NETWORK_HEALTH_COLORS[health]}-500">
                    {localize(`views.dashboard.network.${health}`)}
                </Text>
            </div>
        </div>
    </SettingsSection>
{/if}
