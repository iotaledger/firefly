<script lang="typescript">
    import {
        NetworkConfigurationSettingsRoute,
        networkConfigurationSettingsRoute,
        networkConfigurationSettingsRouter,
    } from '../../../../../../../../lib/routers'
    import {
        NetworkConfigurationAddUpdateNodeView,
        NetworkConfigurationInitView,
        NetworkConfigurationNodeInfoView,
    } from './views'

    $: selectedNode = $networkConfigurationSettingsRouter.getSelectedNodeStore()

    function onAddNodeSuccess(): void {
        if ($networkConfigurationSettingsRoute === NetworkConfigurationSettingsRoute.AddNode) {
            $networkConfigurationSettingsRouter.previous()
        }
    }
</script>

{#if $networkConfigurationSettingsRoute === NetworkConfigurationSettingsRoute.Init}
    <NetworkConfigurationInitView />
{:else if $networkConfigurationSettingsRoute === NetworkConfigurationSettingsRoute.NodeDetails}
    <NetworkConfigurationNodeInfoView node={$selectedNode} />
{:else if $networkConfigurationSettingsRoute === NetworkConfigurationSettingsRoute.AddNode}
    <NetworkConfigurationAddUpdateNodeView node={$selectedNode} onSuccess={onAddNodeSuccess} />
{/if}
