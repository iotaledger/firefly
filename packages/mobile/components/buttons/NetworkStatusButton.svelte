<script lang="ts">
    import { localize } from '@core/i18n'
    import { NetworkHealth, networkStatus, NETWORK_HEALTH_COLORS, nodeInfo } from '@core/network'
    import { Icon as IconTypes } from '@lib/auxiliary/icon'
    import { ProfileActionButton } from '@components'

    export let onClick: () => unknown

    let health: NetworkHealth

    $: health = $networkStatus.health ?? NetworkHealth.Down
    $: healthColor = `${NETWORK_HEALTH_COLORS[health]}-500`
    $: description = $networkStatus.health ?? NetworkHealth.Disconnected
</script>

<ProfileActionButton
    primaryText={$nodeInfo?.protocol?.networkName}
    secondaryText={localize(`views.dashboard.network.${description}`)}
    icon={IconTypes.Network}
    iconColor={healthColor}
    color={healthColor}
    {onClick}
/>
