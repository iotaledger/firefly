<script lang="typescript">
    import { NetworkConfigurationSettingsAction } from '../../../../../../../../lib/contexts/settings'
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

    function onNodeEditClick(): void {
        $networkConfigurationSettingsRouter.next({ action: NetworkConfigurationSettingsAction.EditNode })
    }

    function onAddNodeSuccess(): void {
        if ($networkConfigurationSettingsRoute === NetworkConfigurationSettingsRoute.AddNode) {
            $networkConfigurationSettingsRouter.previous()
        }
    }

    function onEditNodeSuccess(): void {
        if ($networkConfigurationSettingsRoute === NetworkConfigurationSettingsRoute.EditNode) {
            $networkConfigurationSettingsRouter.previous()
        }
    }
</script>

{#if $networkConfigurationSettingsRoute === NetworkConfigurationSettingsRoute.Init}
    <NetworkConfigurationInitView />
{:else if $networkConfigurationSettingsRoute === NetworkConfigurationSettingsRoute.NodeDetails}
    <NetworkConfigurationNodeInfoView node={$selectedNode} onEditClick={onNodeEditClick} />
{:else if $networkConfigurationSettingsRoute === NetworkConfigurationSettingsRoute.AddNode}
    <NetworkConfigurationAddUpdateNodeView node={$selectedNode} onSuccess={onAddNodeSuccess} />
{:else if $networkConfigurationSettingsRoute === NetworkConfigurationSettingsRoute.EditNode}
    <NetworkConfigurationAddUpdateNodeView isEditingNode node={$selectedNode} onSuccess={onEditNodeSuccess} />
{/if}
