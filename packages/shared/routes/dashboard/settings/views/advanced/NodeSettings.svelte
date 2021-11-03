<script language="typescript">
    import { Button, Checkbox, HR, Radio, Text } from 'shared/components'
    import { clickOutside } from 'shared/lib/actions'
    import { localize } from 'shared/lib/i18n'
    import { openPopup } from 'shared/lib/popup'
    import { buildAccountNetworkSettings } from 'shared/lib/wallet'

    export let id

    // TODO: wait for developer profile PR to polish this
    let { automaticNodeSelection, includeOfficialNodes, nodes, primaryNodeUrl } = buildAccountNetworkSettings()

    let nodesContainer
    let contextPosition = { x: 0, y: 0 }
    let nodeContextMenu = undefined

    function handlePropertiesNodeClick(node) {
        openPopup({
            type: 'addNode',
            props: {
                node,
                nodes,
                onSuccess: (updatedNode) => {
                    const idx = nodes.findIndex((n) => n.url === node.url)
                    if (idx >= 0) {
                        nodes[idx] = { ...updatedNode, disabled: node.disabled, isCustom: true }
                    }
                    if (primaryNodeUrl === node.url) {
                        primaryNodeUrl = updatedNode.url
                    }
                },
            },
        })
    }

    function handleAddNodeClick() {
        openPopup({
            type: 'addNode',
            props: {
                nodes,
                onSuccess: (node) => {
                    nodes = [...nodes, { ...node, disabled: false, isCustom: true }]
                    // On adding a new item scroll to the bottom of the nodes container
                    // so you can see the node you added
                    setTimeout(() => {
                        nodesContainer.scrollTop = nodesContainer.scrollHeight
                    }, 100)
                },
            },
        })
    }

    function handleRemoveNodeClick(node) {
        openPopup({
            type: 'removeNode',
            props: {
                node,
                onSuccess: (node) => {
                    nodes = nodes.filter((n) => n.url !== node.url)
                },
            },
        })
    }
</script>

<style type="text/scss">
    .nodes-container {
        max-height: 338px;
    }
</style>

<section {id} class="w-full sm:w-3/4">
    <Text type="h4" classes="mb-3">{localize('views.settings.nodeSettings.title')}</Text>
    <Text type="p" secondary classes="mb-5">{localize('views.settings.nodeSettings.description')}</Text>
    <Radio value={true} bind:group={automaticNodeSelection} label={localize('general.automaticNodeSelection')} />
    <Radio value={false} bind:group={automaticNodeSelection} label={localize('general.manualNodeSelection')} />
    {#if !automaticNodeSelection}
        <HR classes="pb-5 mt-5 justify-center" />
        <section id="configureNodeList">
            <Text type="h4" classes="mb-3">{localize('views.settings.configureNodeList.title')}</Text>
            <Text type="p" secondary classes="mb-5">{localize('views.settings.configureNodeList.description')}</Text>
            <Checkbox
                label={localize('views.settings.configureNodeList.includeOfficialNodeList')}
                bind:checked={includeOfficialNodes}
                classes="mb-5" />
            <div
                class="nodes-container flex flex-col border border-solid border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 rounded-2xl overflow-auto"
                bind:this={nodesContainer}>
                {#if nodes.length === 0}
                    <Text classes="p-3">{localize('views.settings.configureNodeList.noNodes')}</Text>
                {/if}
                {#each nodes as node}
                    <div
                        class="flex flex-row items-center justify-between py-4 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20">
                        <div class="flex flex-row items-center overflow-hidden">
                            <Text
                                classes={`overflow-hidden whitespace-nowrap overflow-ellipsis ${node.disabled ? 'opacity-50' : ''}`}>
                                {node.url}
                            </Text>
                            <Text highlighted classes="mx-4">
                                {node.url === primaryNodeUrl ? localize('views.settings.configureNodeList.primaryNode') : ''}
                            </Text>
                        </div>
                        <button
                            on:click={(e) => {
                                nodeContextMenu = node
                                contextPosition = { x: e.clientX, y: e.clientY }
                            }}
                            class="dark:text-white">...</button>
                    </div>
                {/each}
                {#if nodeContextMenu}
                    <div
                        class="fixed flex flex-col border border-solid bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 rounded-lg overflow-hidden"
                        use:clickOutside={{ includeScroll: true }}
                        on:clickOutside={() => (nodeContextMenu = undefined)}
                        style={`left: ${contextPosition.x - 10}px; top: ${contextPosition.y - 10}px`}>
                        {#if !nodeContextMenu.disabled}
                            <button
                                on:click={() => {
                                    primaryNodeUrl = nodeContextMenu.url
                                    nodeContextMenu = undefined
                                }}
                                class="flex p-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20">
                                <Text smaller>{localize('views.settings.configureNodeList.setAsPrimary')}</Text>
                            </button>
                        {/if}
                        {#if nodeContextMenu.isCustom}
                            <button
                                on:click={() => {
                                    handlePropertiesNodeClick(nodeContextMenu)
                                    nodeContextMenu = undefined
                                }}
                                class="flex p-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20">
                                <Text smaller>{localize('views.settings.configureNodeList.viewDetails')}</Text>
                            </button>
                        {/if}
                        {#if nodeContextMenu.url !== primaryNodeUrl}
                            <button
                                on:click={() => {
                                    nodeContextMenu.disabled = !nodeContextMenu.disabled
                                    nodeContextMenu = undefined
                                    // The disabled state does not propogate to the item UI
                                    // so by reassiging the array we force a redraw
                                    nodes = nodes
                                }}
                                class="flex p-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20">
                                <Text smaller>
                                    {localize(nodeContextMenu.disabled ? 'views.settings.configureNodeList.includeNode' : 'views.settings.configureNodeList.excludeNode')}
                                </Text>
                            </button>
                        {/if}
                        {#if nodeContextMenu.isCustom && nodeContextMenu.url !== primaryNodeUrl}
                            <HR />
                            <button
                                on:click={() => {
                                    handleRemoveNodeClick(nodeContextMenu)
                                    nodeContextMenu = undefined
                                }}
                                class="flex p-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20">
                                <Text smaller error>{localize('views.settings.configureNodeList.removeNode')}</Text>
                            </button>
                        {/if}
                    </div>
                {/if}
            </div>
            <Button medium inlineStyle="min-width: 156px;" classes="w-1/4 mt-4" onClick={() => handleAddNodeClick()}>
                {localize('actions.addNode')}
            </Button>
        </section>
    {/if}
</section>
