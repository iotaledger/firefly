<script lang="typescript">
    import {
        NetworkConfigurationSettingsRoute,
        networkConfigurationSettingsRoute,
        networkConfigurationSettingsRouter,
    } from '../../../../../../../../lib/routers'
    import { NetworkConfigurationInitNodeInfoView, NetworkConfigurationInitView } from './views'

    $: selectedNode = $networkConfigurationSettingsRouter.getSelectedNodeStore()
</script>

{#if $networkConfigurationSettingsRoute === NetworkConfigurationSettingsRoute.Init}
    <NetworkConfigurationInitView />
{:else if $networkConfigurationSettingsRoute === NetworkConfigurationSettingsRoute.NodeDetails}
    <NetworkConfigurationInitNodeInfoView node={$selectedNode} />
{/if}
