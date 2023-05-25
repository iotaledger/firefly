<script lang="ts">
    import { HR, MenuItem, Modal } from 'shared/components'
    import { localize } from '@core/i18n'
    import { closeOverlay, openOverlay } from '@overlay/actions'
    import {
        removeNodeFromClientOptions,
        toggleDisabledNodeInClientOptions,
        togglePrimaryNodeInClientOptions,
    } from '@core/network/actions'
    import { IClientOptions, INode } from '@core/network/interfaces'
    import { getOfficialNodes } from '@core/network/utils'
    import { activeProfile } from '@core/profile/stores'
    import { PopupId } from '@overlay'

    export let node: INode
    export let clientOptions: IClientOptions
    export let modal: Modal = undefined

    $: isOfficialNode = getOfficialNodes($activeProfile?.networkProtocol, $activeProfile?.networkType).some(
        (n) => n.url === node?.url
    )
    $: allowDisableOrRemove = node?.disabled || clientOptions?.nodes?.filter((node) => !node.disabled)?.length > 1
    $: isPrimary = clientOptions?.primaryNode?.url === node.url

    function onEditNodeDetailsClick(): void {
        openOverlay({
            id: PopupId.AddNode,
            props: {
                node,
                isEditingNode: true,
                onSuccess: () => {
                    closeOverlay()
                },
            },
        })
        modal?.toggle()
    }

    async function onTogglePrimaryNodeClick(): Promise<void> {
        if (isPrimary) {
            openOverlay({
                id: PopupId.Confirmation,
                props: {
                    title: localize('popups.unsetAsPrimaryNode.title'),
                    description: localize('popups.unsetAsPrimaryNode.body', { values: { url: node.url } }),
                    danger: true,
                    confirmText: localize('actions.clear'),
                    onConfirm: () => {
                        void togglePrimaryNodeInClientOptions(node)
                        closeOverlay()
                    },
                },
            })
        } else {
            await togglePrimaryNodeInClientOptions(node)
        }
        modal?.toggle()
    }

    function onRemoveNodeClick(): void {
        openOverlay({
            id: PopupId.Confirmation,
            props: {
                title: localize('popups.node.titleRemove'),
                description: localize('popups.node.removeConfirmation'),
                danger: true,
                confirmText: localize('actions.removeNode'),
                onConfirm: () => {
                    void removeNodeFromClientOptions(node)
                    closeOverlay()
                },
            },
        })
        modal?.toggle()
    }

    function onToggleDisabledNodeClick(): void {
        if (node.disabled) {
            void toggleDisabledNodeInClientOptions(node)
        } else {
            openOverlay({
                id: PopupId.Confirmation,
                props: {
                    title: localize('popups.excludeNode.title'),
                    description: localize('popups.excludeNode.body', { values: { url: node?.url } }),
                    danger: true,
                    confirmText: localize('views.settings.configureNodeList.excludeNode'),
                    onConfirm: () => {
                        void toggleDisabledNodeInClientOptions(node)
                        closeOverlay()
                    },
                },
            })
        }
        modal?.toggle()
    }
</script>

<Modal bind:this={modal} size="small">
    <MenuItem
        title={localize('views.settings.configureNodeList.editDetails')}
        onClick={onEditNodeDetailsClick}
        disabled={isOfficialNode}
    />
    <MenuItem
        disabled={node?.disabled}
        title={localize(`views.settings.configureNodeList.${isPrimary ? 'unsetAsPrimary' : 'setAsPrimary'}`)}
        onClick={onTogglePrimaryNodeClick}
    />
    <MenuItem
        disabled={!allowDisableOrRemove}
        title={localize(`views.settings.configureNodeList.${node.disabled ? 'include' : 'exclude'}Node`)}
        onClick={onToggleDisabledNodeClick}
    />
    <HR />
    <MenuItem
        disabled={!allowDisableOrRemove}
        title={localize('views.settings.configureNodeList.removeNode')}
        onClick={onRemoveNodeClick}
        variant="error"
    />
</Modal>
