<script lang="ts">
    import { NetworkInformationSettingsAction } from '@/contexts/settings'
    import {
        NetworkInformationSettingsRoute,
        networkInformationSettingsRoute,
        networkInformationSettingsRouter,
    } from '@/routers'
    import {
        removeNodeFromClientOptions,
        toggleDisabledNodeInClientOptions,
        togglePrimaryNodeInClientOptions,
    } from '@core/network'
    import { activeProfile } from '@core/profile'
    import {
        NetworkInformationAddUpdateNodeView,
        NetworkInformationInitView,
        NetworkInformationNodeConfirmationView,
        NetworkInformationNodeInfoView,
    } from './views'

    $: $networkInformationSettingsRoute === NetworkInformationSettingsRoute.Init &&
        $networkInformationSettingsRouter.getSelectedNodeStore().set(undefined)
    $: selectedNode = $networkInformationSettingsRouter.getSelectedNodeStore()

    function onNodeEditClick(): void {
        $networkInformationSettingsRouter.next({ action: NetworkInformationSettingsAction.EditNode })
    }
    function onEditNodeSuccess(): void {
        if ($networkInformationSettingsRoute === NetworkInformationSettingsRoute.EditNode) {
            $networkInformationSettingsRouter.previous()
        }
    }
    function onAddNodeSuccess(): void {
        if ($networkInformationSettingsRoute === NetworkInformationSettingsRoute.AddNode) {
            $networkInformationSettingsRouter.previous()
        }
    }
    function onTogglePrimaryClick(): void {
        const isPrimary = $activeProfile?.clientOptions?.primaryNode?.url === $selectedNode.url
        if ($networkInformationSettingsRoute === NetworkInformationSettingsRoute.NodeDetails) {
            if (!isPrimary) {
                void togglePrimaryNodeInClientOptions($selectedNode)
                $networkInformationSettingsRouter.previous()
            } else {
                $networkInformationSettingsRouter.next({
                    action: NetworkInformationSettingsAction.UnsetAsPrimaryNode,
                })
            }
        } else if (
            $networkInformationSettingsRoute === NetworkInformationSettingsRoute.UnsetAsPrimaryNodeConfirmation
        ) {
            void togglePrimaryNodeInClientOptions($selectedNode)
            $networkInformationSettingsRouter.reset()
        }
    }
    function onToggleDisabledClick(): void {
        if ($networkInformationSettingsRoute === NetworkInformationSettingsRoute.NodeDetails) {
            if ($selectedNode.disabled) {
                void toggleDisabledNodeInClientOptions($selectedNode)
                $networkInformationSettingsRouter.previous()
            } else {
                $networkInformationSettingsRouter.next({
                    action: NetworkInformationSettingsAction.ExcludeNode,
                })
            }
        } else if ($networkInformationSettingsRoute === NetworkInformationSettingsRoute.ExcludeNodeConfirmation) {
            void toggleDisabledNodeInClientOptions($selectedNode)
            $networkInformationSettingsRouter.reset()
        }
    }
    function onDeleteNodeClick(): void {
        if ($networkInformationSettingsRoute === NetworkInformationSettingsRoute.NodeDetails) {
            $networkInformationSettingsRouter.next({
                action: NetworkInformationSettingsAction.DeleteNode,
            })
        } else if ($networkInformationSettingsRoute === NetworkInformationSettingsRoute.DeleteNodeConfirmation) {
            void removeNodeFromClientOptions($selectedNode)
            $networkInformationSettingsRouter.reset()
        }
    }
    function onConfirmViewCancelClick(): void {
        $networkInformationSettingsRouter.previous()
    }
</script>

{#if $networkInformationSettingsRoute === NetworkInformationSettingsRoute.Init}
    <NetworkInformationInitView />
{:else if $networkInformationSettingsRoute === NetworkInformationSettingsRoute.NodeDetails}
    <NetworkInformationNodeInfoView
        node={$selectedNode}
        onEditClick={onNodeEditClick}
        {onTogglePrimaryClick}
        {onToggleDisabledClick}
        onRemoveClick={onDeleteNodeClick}
    />
{:else if $networkInformationSettingsRoute === NetworkInformationSettingsRoute.AddNode}
    <NetworkInformationAddUpdateNodeView node={$selectedNode} onSuccess={onAddNodeSuccess} />
{:else if $networkInformationSettingsRoute === NetworkInformationSettingsRoute.EditNode}
    <NetworkInformationAddUpdateNodeView isEditingNode node={$selectedNode} onSuccess={onEditNodeSuccess} />
{:else if $networkInformationSettingsRoute === NetworkInformationSettingsRoute.UnsetAsPrimaryNodeConfirmation}
    <NetworkInformationNodeConfirmationView
        action={NetworkInformationSettingsAction.UnsetAsPrimaryNode}
        onConfirm={onTogglePrimaryClick}
        onCancel={onConfirmViewCancelClick}
        node={$selectedNode}
    />
{:else if $networkInformationSettingsRoute === NetworkInformationSettingsRoute.ExcludeNodeConfirmation}
    <NetworkInformationNodeConfirmationView
        action={NetworkInformationSettingsAction.ExcludeNode}
        onConfirm={onToggleDisabledClick}
        onCancel={onConfirmViewCancelClick}
        node={$selectedNode}
    />
{:else if $networkInformationSettingsRoute === NetworkInformationSettingsRoute.DeleteNodeConfirmation}
    <NetworkInformationNodeConfirmationView
        action={NetworkInformationSettingsAction.DeleteNode}
        onConfirm={onDeleteNodeClick}
        onCancel={onConfirmViewCancelClick}
        node={$selectedNode}
    />
{/if}
