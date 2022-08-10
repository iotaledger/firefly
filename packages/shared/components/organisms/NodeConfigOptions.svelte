<script lang="typescript">
    import { HR, Text } from 'shared/components'
    import { clickOutside } from 'shared/lib/actions'
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

    export let nodeContextMenu: INode
    export let contextPosition: {
        x: number
        y: number
    }
    export let clientOptions: IClientOptions

    $: isOfficialNode = getOfficialNodes($activeProfile?.networkProtocol, $activeProfile?.networkType).some(
        (n) => n.url === nodeContextMenu?.url
    )
    $: isOnlyOneNode = clientOptions?.nodes?.length === 1
    $: allowToggleDisabled =
        nodeContextMenu?.disabled || clientOptions?.nodes?.filter((node) => !node.disabled)?.length > 1

    function handleViewNodeInfoClick(node: INode): void {
        openPopup({
            type: 'nodeInfo',
            props: {
                node,
            },
        })
        nodeContextMenu = undefined
    }

    function handleEditNodeDetailsClick(node: INode): void {
        openPopup({
            type: 'addNode',
            props: {
                node,
                isEditingNode: true,
                onSuccess: () => {
                    nodeContextMenu = undefined
                    closePopup()
                },
            },
        })
    }

    function handleRemoveNodeClick(node: INode): void {
        openPopup({
            type: 'confirmation',
            props: {
                title: localize('popups.node.titleRemove'),
                description: localize('popups.node.removeConfirmation'),
                danger: true,
                confirmText: localize('actions.removeNode'),
                onConfirm: () => {
                    void removeNodeFromClientOptions(node)
                    nodeContextMenu = undefined
                    closePopup()
                },
            },
        })
    }

    function handleToggleDisabledNodeClick(node: INode): void {
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
        nodeContextMenu = undefined
    }
</script>

<node-config-options
    class="fixed flex flex-col border border-solid bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 rounded-lg overflow-hidden"
    use:clickOutside={{ includeScroll: true }}
    on:clickOutside={() => (nodeContextMenu = undefined)}
    style={`left: ${contextPosition.x - 10}px; top: ${contextPosition.y - 10}px`}
>
    <button
        on:click={() => handleViewNodeInfoClick(nodeContextMenu)}
        class="flex p-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20"
    >
        <Text smaller>{localize('views.settings.configureNodeList.viewInfo')}</Text>
    </button>

    <button
        disabled={isOfficialNode}
        on:click={() => handleEditNodeDetailsClick(nodeContextMenu)}
        class="flex p-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20"
    >
        <Text smaller>{localize('views.settings.configureNodeList.editDetails')}</Text>
    </button>
    <button
        disabled={!allowToggleDisabled}
        on:click={() => handleToggleDisabledNodeClick(nodeContextMenu)}
        class="flex p-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20"
    >
        <Text smaller>
            {localize(`views.settings.configureNodeList.${nodeContextMenu.disabled ? 'include' : 'exclude'}Node`)}
        </Text>
    </button>
    <HR />
    <button
        disabled={isOnlyOneNode}
        on:click={() => handleRemoveNodeClick(nodeContextMenu)}
        class="flex p-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20"
    >
        <Text smaller error>{localize('views.settings.configureNodeList.removeNode')}</Text>
    </button>
</node-config-options>
