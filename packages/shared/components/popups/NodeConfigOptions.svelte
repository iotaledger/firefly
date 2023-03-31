<script lang="typescript">
    import { localize } from '@core/i18n'
    import { Button, HR } from 'shared/components'
    import { getOfficialNodes, updateClientOptions } from 'shared/lib/network'
    import { closePopup, openPopup } from 'shared/lib/popup'
    import { updateProfile } from 'shared/lib/profile'
    import { NetworkConfig } from 'shared/lib/typings/network'
    import { Node } from 'shared/lib/typings/node'
    import { onDestroy } from 'svelte'
    import { popupState } from 'shared/lib/popup'

    export let networkConfig: NetworkConfig
    export let nodeContextMenu: Node = undefined
    export let ensureOnePrimaryNode: () => void
    export let onPopupDestroy = (..._: any[]): void => {}
    export let handleEditNodeDetailsClick = (..._: any[]): void => {}

    $: if (networkConfig) {
        updateClientOptions(networkConfig)
        updateProfile('settings.networkConfig', networkConfig)
    }

    onDestroy(() => {
        onPopupDestroy(networkConfig.nodes)
    })

    function handleSetPrimaryNode(node: Node) {
        networkConfig.nodes = networkConfig.nodes.map((n) => ({ ...n, isPrimary: n.url === node.url }))
        updateClientOptions(networkConfig)
        updateProfile('settings.networkConfig', networkConfig)
        closePopup()
    }

    function handleViewNodeInfoClick(node: Node) {
        openPopup({
            type: 'nodeInfo',
            props: {
                node,
            },
        })
    }

    function handleRemoveNodeClick(node: Node) {
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

<div class="flex flex-col flex-wrap space-y-4 p-8">
    {#if !nodeContextMenu?.isDisabled}
        <Button medium onClick={() => handleSetPrimaryNode(nodeContextMenu)}>
            {localize('views.settings.configureNodeList.setAsPrimary')}
        </Button>
        <Button
            medium
            onClick={() => {
                handleViewNodeInfoClick(nodeContextMenu)
                nodeContextMenu = undefined
            }}
        >
            {localize('views.settings.configureNodeList.viewInfo')}
        </Button>
    {/if}
    {#if !getOfficialNodes(networkConfig?.network.type)
        .map((n) => n.url)
        .includes(nodeContextMenu?.url)}
        <Button
            medium
            onClick={() => {
                handleEditNodeDetailsClick(nodeContextMenu)
                nodeContextMenu = undefined
            }}
        >
            {localize('views.settings.configureNodeList.editDetails')}
        </Button>
    {/if}
    {#if nodeContextMenu && nodeContextMenu.url !== networkConfig?.nodes?.find((n) => n.isPrimary)?.url}
        <Button
            medium
            onClick={() => {
                nodeContextMenu.isDisabled = !nodeContextMenu.isDisabled
                networkConfig.nodes = networkConfig.nodes.map((n) => ({
                    ...n,
                    isDisabled: n.url === nodeContextMenu.url && nodeContextMenu.isDisabled,
                }))
                closePopup()
            }}
        >
            {localize(
                nodeContextMenu.isDisabled
                    ? 'views.settings.configureNodeList.includeNode'
                    : 'views.settings.configureNodeList.excludeNode'
            )}
        </Button>
    {/if}
    {#if !getOfficialNodes(networkConfig?.network?.type)
        .map((n) => n.url)
        .includes(nodeContextMenu?.url)}
        <HR />
        <Button
            medium
            warning
            onClick={() => {
                handleRemoveNodeClick(nodeContextMenu)
                nodeContextMenu = undefined
            }}
        >
            {localize('views.settings.configureNodeList.removeNode')}
        </Button>
    {/if}
</div>
