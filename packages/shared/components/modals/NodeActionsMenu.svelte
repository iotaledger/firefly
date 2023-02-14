<script lang="ts">
    import { HR, MenuItem, Modal } from 'shared/components'
    import { localize } from '@core/i18n'
    import { closePopup, openPopup } from '@auxiliary/popup/actions'
    import { Platform } from '@core/app/classes'
    import {
        removeNodeFromClientOptions,
        toggleDisabledNodeInClientOptions,
        togglePrimaryNodeInClientOptions,
    } from '@core/network/actions'
    import { IClientOptions, INode } from '@core/network/interfaces'
    import { getOfficialNodes } from '@core/network/utils'
    import { activeProfile } from '@core/profile/stores'
    import { registerProposalsFromPrimaryNode } from '@contexts/governance/actions'

    export let node: INode
    export let clientOptions: IClientOptions
    export let modal: Modal = undefined

    $: isOfficialNode = getOfficialNodes($activeProfile?.networkProtocol, $activeProfile?.networkType).some(
        (n) => n.url === node?.url
    )
    $: allowDisableOrRemove = node?.disabled || clientOptions?.nodes?.filter((node) => !node.disabled)?.length > 1
    $: isPrimary = clientOptions?.primaryNode?.url === node.url

    function handleEditNodeDetailsClick(): void {
        openPopup({
            type: 'addNode',
            props: {
                node,
                isEditingNode: true,
                onSuccess: () => {
                    closePopup()
                },
            },
        })
        modal?.toggle()
    }

    async function handleTogglePrimaryNodeClick(): Promise<void> {
        if (isPrimary) {
            openPopup({
                type: 'confirmation',
                props: {
                    title: localize('popups.unsetAsPrimaryNode.title'),
                    description: localize('popups.unsetAsPrimaryNode.body', { values: { url: node.url } }),
                    danger: true,
                    confirmText: localize('actions.clear'),
                    onConfirm: () => {
                        void togglePrimaryNodeInClientOptions(node)
                        closePopup()
                    },
                },
            })
        } else {
            await togglePrimaryNodeInClientOptions(node)
            if (Platform.isFeatureFlagEnabled('governance')) {
                await registerProposalsFromPrimaryNode()
            }
        }
        modal?.toggle()
    }

    function handleRemoveNodeClick(): void {
        openPopup({
            type: 'confirmation',
            props: {
                title: localize('popups.node.titleRemove'),
                description: localize('popups.node.removeConfirmation'),
                danger: true,
                confirmText: localize('actions.removeNode'),
                onConfirm: () => {
                    void removeNodeFromClientOptions(node)
                    closePopup()
                },
            },
        })
        modal?.toggle()
    }

    function handleToggleDisabledNodeClick(): void {
        if (node.disabled) {
            void toggleDisabledNodeInClientOptions(node)
        } else {
            openPopup({
                type: 'confirmation',
                props: {
                    title: localize('popups.excludeNode.title'),
                    description: localize('popups.excludeNode.body', { values: { url: node?.url } }),
                    danger: true,
                    confirmText: localize('views.settings.configureNodeList.excludeNode'),
                    onConfirm: () => {
                        void toggleDisabledNodeInClientOptions(node)
                        closePopup()
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
        onClick={handleEditNodeDetailsClick}
        disabled={isOfficialNode}
    />
    <MenuItem
        disabled={node?.disabled}
        title={localize(`views.settings.configureNodeList.${isPrimary ? 'unsetAsPrimary' : 'setAsPrimary'}`)}
        onClick={handleTogglePrimaryNodeClick}
    />
    <MenuItem
        disabled={!allowDisableOrRemove}
        title={localize(`views.settings.configureNodeList.${node.disabled ? 'include' : 'exclude'}Node`)}
        onClick={handleToggleDisabledNodeClick}
    />
    <HR />
    <MenuItem
        disabled={!allowDisableOrRemove}
        title={localize('views.settings.configureNodeList.removeNode')}
        onClick={handleRemoveNodeClick}
        variant="error"
    />
</Modal>
