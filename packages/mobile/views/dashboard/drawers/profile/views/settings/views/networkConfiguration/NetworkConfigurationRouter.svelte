<script lang="typescript">
    import {
        NetworkConfigurationSettingsRoute,
        networkConfigurationSettingsRoute,
    } from '../../../../../../../../lib/routers'
    import { NetworkConfigurationInitNodeInfoView, NetworkConfigurationInitView } from './views'
</script>

{#if $networkConfigurationSettingsRoute === NetworkConfigurationSettingsRoute.Init}
    <NetworkConfigurationInitView />
{:else if $networkConfigurationSettingsRoute === NetworkConfigurationSettingsRoute.NodeDetails}
    <NetworkConfigurationInitNodeInfoView />
{/if}
