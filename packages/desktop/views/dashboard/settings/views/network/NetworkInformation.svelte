<script lang="ts">
    import { localize } from '@core/i18n'
    import {
        NetworkHealth,
        networkStatus,
        NETWORK_HEALTH_COLORS,
        NETWORK_STATUS_DESCRIPTION,
        nodeInfo,
    } from '@core/network'
    import { NetworkSettingsRoute } from '@core/router'
    import { Text } from 'shared/components'
    import SettingsSection from '../SettingsSection.svelte'
</script>

<SettingsSection setting={NetworkSettingsRoute.NetworkInformation}>
    <div class="flex flex-row justify-between">
        <div class="flex flex-col space-y-1">
            <Text secondary>
                {localize('views.settings.networkInformation.connectedTo')}:
            </Text>
            <Text highlighted>{$nodeInfo?.protocol?.networkName}</Text>
        </div>
        <div class="flex flex-col space-y-1">
            <Text secondary>{localize('views.dashboard.network.status')}:</Text>
            <Text color="{NETWORK_HEALTH_COLORS[$networkStatus.health || 0]}-500">
                {localize(
                    `views.dashboard.network.${
                        $networkStatus.description || NETWORK_STATUS_DESCRIPTION[NetworkHealth.Disconnected]
                    }`
                )}
            </Text>
        </div>
    </div>
</SettingsSection>
