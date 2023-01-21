<script lang="typescript">
    import { togglePrimaryNodeInClientOptions } from '@core/network'
    import { activeProfile } from '@core/profile'
    import { NetworkConfigurationSettingsAction } from '../../../../../../../../lib/contexts/settings'
    import {
        NetworkConfigurationSettingsRoute,
        networkConfigurationSettingsRoute,
        networkConfigurationSettingsRouter,
    } from '../../../../../../../../lib/routers'
    import {
        NetworkConfigurationAddUpdateNodeView,
        NetworkConfigurationInitView,
        NetworkConfigurationNodeConfirmationView,
        NetworkConfigurationNodeInfoView,
    } from './views'

    $: selectedNode = $networkConfigurationSettingsRouter.getSelectedNodeStore()

    function onNodeEditClick(): void {
        $networkConfigurationSettingsRouter.next({ action: NetworkConfigurationSettingsAction.EditNode })
    }
    function onEditNodeSuccess(): void {
        if ($networkConfigurationSettingsRoute === NetworkConfigurationSettingsRoute.EditNode) {
            $networkConfigurationSettingsRouter.previous()
        }
    }
    function onAddNodeSuccess(): void {
        if ($networkConfigurationSettingsRoute === NetworkConfigurationSettingsRoute.AddNode) {
            $networkConfigurationSettingsRouter.previous()
        }
    }
    function handleTooglePrimaryNode(): void {
        const isPrimary = $activeProfile?.clientOptions?.primaryNode?.url === $selectedNode.url
        if ($networkConfigurationSettingsRoute === NetworkConfigurationSettingsRoute.NodeDetails) {
            if (!isPrimary) {
                togglePrimaryNodeInClientOptions($selectedNode)
            } else {
                $networkConfigurationSettingsRouter.next({
                    action: NetworkConfigurationSettingsAction.UnsetAsPrimaryNode,
                })
            }
        } else if (
            $networkConfigurationSettingsRoute === NetworkConfigurationSettingsRoute.UnsetAsPrimaryNodeConfirmation
        ) {
            togglePrimaryNodeInClientOptions($selectedNode)
            $networkConfigurationSettingsRouter.previous()
        }
    }
    function onConfirmViewCancelClick(): void {
        $networkConfigurationSettingsRouter.previous()
    }
</script>

{#if $networkConfigurationSettingsRoute === NetworkConfigurationSettingsRoute.Init}
    <NetworkConfigurationInitView />
{:else if $networkConfigurationSettingsRoute === NetworkConfigurationSettingsRoute.NodeDetails}
    <NetworkConfigurationNodeInfoView
        node={$selectedNode}
        onEditClick={onNodeEditClick}
        onTogglePrimaryClick={handleTooglePrimaryNode}
    />
{:else if $networkConfigurationSettingsRoute === NetworkConfigurationSettingsRoute.AddNode}
    <NetworkConfigurationAddUpdateNodeView node={$selectedNode} onSuccess={onAddNodeSuccess} />
{:else if $networkConfigurationSettingsRoute === NetworkConfigurationSettingsRoute.EditNode}
    <NetworkConfigurationAddUpdateNodeView isEditingNode node={$selectedNode} onSuccess={onEditNodeSuccess} />
{:else if $networkConfigurationSettingsRoute === NetworkConfigurationSettingsRoute.UnsetAsPrimaryNodeConfirmation}
    <NetworkConfigurationNodeConfirmationView
        action={NetworkConfigurationSettingsAction.UnsetAsPrimaryNode}
        onConfirm={handleTooglePrimaryNode}
        onCancel={onConfirmViewCancelClick}
        node={$selectedNode}
    />
{/if}
