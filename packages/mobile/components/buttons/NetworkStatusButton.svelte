<script lang="ts">
    import { localize } from '@core/i18n'
    import { NetworkHealth, networkStatus, NETWORK_HEALTH_COLORS, nodeInfo } from '@core/network'
    import { Icon as IconTypes } from '@lib/auxiliary/icon'
    import { ProfileActionButton } from '@components'

    export let onClick: () => unknown

    $: healthColor = `${NETWORK_HEALTH_COLORS[$networkStatus.health ?? NetworkHealth.Down]}-500`
</script>

<ProfileActionButton
    primaryText={$nodeInfo?.protocol?.networkName}
    secondaryText={localize(`views.dashboard.network.${$networkStatus.health ?? NetworkHealth.Disconnected}`)}
    icon={IconTypes.Network}
    iconColor={healthColor}
    color={healthColor}
    {onClick}
/>
