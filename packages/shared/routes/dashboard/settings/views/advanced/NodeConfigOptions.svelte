<script lang="typescript">
    import { HR, Text } from 'shared/components'
    import { clickOutside } from 'shared/lib/actions'
    import { localize } from '@core/i18n'
    import { getOfficialNodes, INetworkConfig, INode, updateClientOptions } from '@core/network'
    import { closePopup, openPopup } from 'shared/lib/popup'
    import { updateActiveProfileSettings } from '@core/profile'

    export let nodeContextMenu: INode
    export let contextPosition: {
        x: number
        y: number
    }
    export let networkConfig: INetworkConfig
    export let ensureOnePrimaryNode: () => void

    function handleSetPrimaryNode(node: INode): void {
        networkConfig.nodes = networkConfig.nodes.map((n) => ({ ...n, isPrimary: n.url === node.url }))
        nodeContextMenu = undefined

        updateClientOptions(networkConfig)
        updateActiveProfileSettings({ networkConfig })
    }

    function handleViewNodeInfoClick(node: INode): void {
        openPopup({
            type: 'nodeInfo',
            props: {
                node,
            },
        })
    }

    function handleEditNodeDetailsClick(node: INode): void {
        openPopup({
            type: 'addNode',
            props: {
                node,
                onSuccess: () => {
                    closePopup()
                },
            },
        })
    }

    function handleRemoveNodeClick(node: INode) {
        openPopup({
            type: 'removeNode',
            props: {
                node,
                onSuccess: (node) => {
                    networkConfig.nodes = networkConfig.nodes.filter((n) => n.url !== node.url)

                    ensureOnePrimaryNode()
                },
            },
        })
    }
</script>

<node-config-options
    class="fixed flex flex-col border border-solid bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 rounded-lg overflow-hidden"
    use:clickOutside={{ includeScroll: true }}
    on:clickOutside={() => (nodeContextMenu = undefined)}
    style={`left: ${contextPosition.x - 10}px; top: ${contextPosition.y - 10}px`}
>
    {#if !nodeContextMenu?.isDisabled}
        <button
            on:click={() => handleSetPrimaryNode(nodeContextMenu)}
            class={'flex p-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20'}
        >
            <Text smaller>{localize('views.settings.configureNodeList.setAsPrimary')}</Text>
        </button>
        <button
            on:click={() => {
                handleViewNodeInfoClick(nodeContextMenu)
                nodeContextMenu = undefined
            }}
            class="flex p-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20"
        >
            <Text smaller>{localize('views.settings.configureNodeList.viewInfo')}</Text>
        </button>
    {/if}
    {#if !getOfficialNodes(networkConfig?.network.protocol, networkConfig?.network.type)
        .map((n) => n.url)
        .includes(nodeContextMenu?.url)}
        <button
            on:click={() => {
                handleEditNodeDetailsClick(nodeContextMenu)
                nodeContextMenu = undefined
            }}
            class="flex p-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20"
        >
            <Text smaller>{localize('views.settings.configureNodeList.editDetails')}</Text>
        </button>
    {/if}
    {#if nodeContextMenu && nodeContextMenu.url !== networkConfig?.nodes?.find((n) => n.isPrimary)?.url}
        <button
            on:click={() => {
                nodeContextMenu.isDisabled = !nodeContextMenu.isDisabled
                networkConfig.nodes = networkConfig.nodes.map((n) => ({
                    ...n,
                    isDisabled: n.url === nodeContextMenu.url && nodeContextMenu.isDisabled,
                }))
                nodeContextMenu = undefined
            }}
            class="flex p-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20"
        >
            <Text smaller>
                {localize(
                    nodeContextMenu.isDisabled
                        ? 'views.settings.configureNodeList.includeNode'
                        : 'views.settings.configureNodeList.excludeNode'
                )}
            </Text>
        </button>
    {/if}
    {#if !getOfficialNodes(networkConfig?.network.protocol, networkConfig?.network?.type)
        .map((n) => n.url)
        .includes(nodeContextMenu?.url)}
        <HR />
        <button
            on:click={() => {
                handleRemoveNodeClick(nodeContextMenu)
                nodeContextMenu = undefined
            }}
            class="flex p-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20"
        >
            <Text smaller error>{localize('views.settings.configureNodeList.removeNode')}</Text>
        </button>
    {/if}
</node-config-options>
