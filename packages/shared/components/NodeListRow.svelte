<script lang="ts">
    import { closePopup, PopupId, openPopup } from '@auxiliary/popup'
    import { EMPTY_NODE, INode } from '@core/network'
    import { activeProfile } from '@core/profile'
    import { Pill } from './pills'
    import { Text, Modal, MeatballMenuButton, MenuItem } from 'shared/components'
    import { localize } from '@core/i18n'
    import {
        removeNodeFromClientOptions,
        toggleDisabledNodeInClientOptions,
        togglePrimaryNodeInClientOptions,
    } from '@core/network/actions'
    import { getOfficialNodes } from '@core/network/utils'
    import { MenuItemVariant } from './enums'

    export let node: INode = EMPTY_NODE

    let modal: Modal | undefined

    $: isOfficialNode = getOfficialNodes($activeProfile?.network?.id).some((n) => n.url === node?.url)
    $: allowDisableOrRemove =
        node?.disabled || ($activeProfile?.clientOptions?.nodes?.filter((node) => !node.disabled)?.length ?? 0) > 1
    $: isPrimary = $activeProfile?.clientOptions?.primaryNode?.url === node.url

    function toggleModal(): void {
        modal?.toggle()
    }

    function onEditNodeDetailsClick(): void {
        openPopup({
            id: PopupId.AddNode,
            props: {
                node,
                isEditingNode: true,
                onSuccess: () => {
                    closePopup()
                },
            },
        })
        toggleModal()
    }

    async function onTogglePrimaryNodeClick(): Promise<void> {
        if (isPrimary) {
            openPopup({
                id: PopupId.Confirmation,
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
        }
        toggleModal()
    }

    function onRemoveNodeClick(): void {
        openPopup({
            id: PopupId.Confirmation,
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
        toggleModal()
    }

    function onToggleDisabledNodeClick(): void {
        if (node.disabled) {
            void toggleDisabledNodeInClientOptions(node)
        } else {
            openPopup({
                id: PopupId.Confirmation,
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
        toggleModal()
    }

    function handleOnClick(): void {
        openPopup({
            id: PopupId.NodeInfo,
            props: {
                node,
            },
        })
    }

    $: MENU_ITEMS = [
        {
            title: localize('views.settings.configureNodeList.editDetails'),
            onClick: onEditNodeDetailsClick,
            disabled: isOfficialNode,
        },
        {
            disabled: node?.disabled,
            title: localize(`views.settings.configureNodeList.${isPrimary ? 'unsetAsPrimary' : 'setAsPrimary'}`),
            onClick: onTogglePrimaryNodeClick,
        },
        {
            disabled: !allowDisableOrRemove,
            title: localize(`views.settings.configureNodeList.${node.disabled ? 'include' : 'exclude'}Node`),
            onClick: onToggleDisabledNodeClick,
            separator: true,
        },
        {
            disabled: !allowDisableOrRemove,
            title: localize('views.settings.configureNodeList.removeNode'),
            onClick: onRemoveNodeClick,
            variant: MenuItemVariant.Error,
        },
    ]
</script>

<button
    class="flex flex-row items-center justify-between py-4 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20"
    on:click={handleOnClick}
>
    <div class="flex flex-row items-center space-x-4 overflow-hidden">
        <Text classes="self-start overflow-hidden whitespace-nowrap text-ellipsis">
            {node.url}
        </Text>
        {#if isPrimary}
            <Pill data={localize('views.settings.configureNodeList.primaryNode').toLowerCase()} textColor="blue-500" />
        {/if}
        {#if node?.disabled}
            <Pill data={localize('general.excluded').toLowerCase()} textColor="red-500" />
        {/if}
    </div>

    <node-actions-button>
        <MeatballMenuButton onClick={toggleModal} />
        <Modal bind:this={modal} size="small">
            {#each MENU_ITEMS as { separator, ...item }}
                <MenuItem {...item} />
                {#if separator}
                    <hr />
                {/if}
            {/each}
        </Modal>
    </node-actions-button>
</button>
