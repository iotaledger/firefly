<script lang="ts">
    import { localize } from '@core/i18n'
    import { NetworkHealth, networkStatus, NETWORK_HEALTH_COLORS, nodeInfoNetworkName } from '@core/network'
    import { NetworkSettingsRoute } from '@core/router'
    import { Text } from 'shared/components'
    import SettingsSection from '../SettingsSection.svelte'

    $: health = $networkStatus.health ?? NetworkHealth.Disconnected
</script>

{#if $nodeInfoNetworkName}
    <SettingsSection setting={NetworkSettingsRoute.NetworkInformation}>
        <div class="flex flex-row justify-between">
            <div class="flex flex-col space-y-1">
                <Text secondary>
                    {localize('views.settings.networkInformation.connectedTo')}:
                </Text>
                <Text highlighted>{$nodeInfoNetworkName}</Text>
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
