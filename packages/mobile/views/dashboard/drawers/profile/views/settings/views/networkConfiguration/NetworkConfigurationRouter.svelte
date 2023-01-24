<script lang="typescript">
    import {
        removeNodeFromClientOptions,
        toggleDisabledNodeInClientOptions,
        togglePrimaryNodeInClientOptions,
    } from '@core/network'
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
    function handleTogglePrimaryNode(): void {
        const isPrimary = $activeProfile?.clientOptions?.primaryNode?.url === $selectedNode.url
        if ($networkConfigurationSettingsRoute === NetworkConfigurationSettingsRoute.NodeDetails) {
            if (!isPrimary) {
                togglePrimaryNodeInClientOptions($selectedNode)
                $networkConfigurationSettingsRouter.previous()
            } else {
                $networkConfigurationSettingsRouter.next({
                    action: NetworkConfigurationSettingsAction.UnsetAsPrimaryNode,
                })
            }
        } else if (
            $networkConfigurationSettingsRoute === NetworkConfigurationSettingsRoute.UnsetAsPrimaryNodeConfirmation
        ) {
            togglePrimaryNodeInClientOptions($selectedNode)
            $networkConfigurationSettingsRouter.reset()
        }
    }
    function handleToggleDisabledNodeClick(): void {
        if ($networkConfigurationSettingsRoute === NetworkConfigurationSettingsRoute.NodeDetails) {
            $networkConfigurationSettingsRouter.next({
                action: NetworkConfigurationSettingsAction.ExcludeNode,
            })
        } else if ($networkConfigurationSettingsRoute === NetworkConfigurationSettingsRoute.ExcludeNodeConfirmation) {
            void removeNodeFromClientOptions($selectedNode)
            $networkConfigurationSettingsRouter.reset()
        }
    }
    function handleDeleteNodeClick(): void {
        if ($networkConfigurationSettingsRoute === NetworkConfigurationSettingsRoute.NodeDetails) {
            if ($selectedNode.disabled) {
                toggleDisabledNodeInClientOptions($selectedNode)
                $networkConfigurationSettingsRouter.previous()
            } else {
                $networkConfigurationSettingsRouter.next({
                    action: NetworkConfigurationSettingsAction.DeleteNode,
                })
            }
        } else if ($networkConfigurationSettingsRoute === NetworkConfigurationSettingsRoute.ExcludeNodeConfirmation) {
            toggleDisabledNodeInClientOptions($selectedNode)
            $networkConfigurationSettingsRouter.reset()
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
        onTogglePrimaryClick={handleTogglePrimaryNode}
        onToggleDisabledClick={handleToggleDisabledNodeClick}
        onRemoveClick={handleDeleteNodeClick}
    />
{:else if $networkConfigurationSettingsRoute === NetworkConfigurationSettingsRoute.AddNode}
    <NetworkConfigurationAddUpdateNodeView node={$selectedNode} onSuccess={onAddNodeSuccess} />
{:else if $networkConfigurationSettingsRoute === NetworkConfigurationSettingsRoute.EditNode}
    <NetworkConfigurationAddUpdateNodeView isEditingNode node={$selectedNode} onSuccess={onEditNodeSuccess} />
{:else if $networkConfigurationSettingsRoute === NetworkConfigurationSettingsRoute.UnsetAsPrimaryNodeConfirmation}
    <NetworkConfigurationNodeConfirmationView
        action={NetworkConfigurationSettingsAction.UnsetAsPrimaryNode}
        onConfirm={handleTogglePrimaryNode}
        onCancel={onConfirmViewCancelClick}
        node={$selectedNode}
    />
{:else if $networkConfigurationSettingsRoute === NetworkConfigurationSettingsRoute.ExcludeNodeConfirmation}
    <NetworkConfigurationNodeConfirmationView
        action={NetworkConfigurationSettingsAction.ExcludeNode}
        onConfirm={handleToggleDisabledNodeClick}
        onCancel={onConfirmViewCancelClick}
        node={$selectedNode}
    />
{:else if $networkConfigurationSettingsRoute === NetworkConfigurationSettingsRoute.DeleteNodeConfirmation}
    <NetworkConfigurationNodeConfirmationView
        action={NetworkConfigurationSettingsAction.DeleteNode}
        onConfirm={handleDeleteNodeClick}
        onCancel={onConfirmViewCancelClick}
        node={$selectedNode}
    />
{/if}
