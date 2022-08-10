<script lang="typescript">
    import { HR, MenuItem, Modal } from 'shared/components'
    import { localize } from '@core/i18n'
    import {
        getOfficialNodes,
        INode,
        IClientOptions,
        removeNodeFromClientOptions,
        toggleDisabledNodeInClientOptions,
    } from '@core/network'
    import { closePopup, openPopup } from 'shared/lib/popup'
    import { activeProfile } from '@core/profile'

    export let node: INode
    export let clientOptions: IClientOptions
    export let modal: Modal

    $: isOfficialNode = getOfficialNodes($activeProfile?.networkProtocol, $activeProfile?.networkType).some(
        (n) => n.url === node?.url
    )
    $: allowDisableOrRemove = node?.disabled || clientOptions?.nodes?.filter((node) => !node.disabled)?.length > 1

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
            toggleDisabledNodeInClientOptions(node)
        } else {
            openPopup({
                type: 'confirmation',
                props: {
                    title: localize('popups.excludeNode.title'),
                    description: localize('popups.excludeNode.body', { values: { url: node?.url } }),
                    danger: true,
                    confirmText: localize('views.settings.configureNodeList.excludeNode'),
                    onConfirm: () => {
                        toggleDisabledNodeInClientOptions(node)
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
        first
    />
    <MenuItem
        disabled={!allowDisableOrRemove}
        title={localize(`views.settings.configureNodeList.${node.disabled ? 'include' : 'exclude'}Node`)}
        onClick={handleToggleDisabledNodeClick}
        last
    />
    <HR />
    <MenuItem
        disabled={!allowDisableOrRemove}
        title={localize('views.settings.configureNodeList.removeNode')}
        onClick={handleRemoveNodeClick}
        first
        last
    />
</Modal>
