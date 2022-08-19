<script lang="typescript">
    import { localize } from '@core/i18n'
    import { Button, Checkbox, HR, Radio, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import {
        ensureSinglePrimaryNode,
        getNodeCandidates,
        getOfficialNetworkConfig,
        isOfficialNetwork,
        updateClientOptions,
    } from 'shared/lib/network'
    import { networkStatus, NETWORK_HEALTH_COLORS } from 'shared/lib/networkStatus'
    import { openPopup } from 'shared/lib/popup'
    import { activeProfile, updateProfile } from 'shared/lib/profile'
    import { NetworkConfig, NetworkStatusHealthText, NetworkType } from 'shared/lib/typings/network'
    import { Node } from 'shared/lib/typings/node'
    import NodeConfigOptions from './NodeConfigOptions.svelte'

    let networkConfig: NetworkConfig =
        $activeProfile?.settings.networkConfig || getOfficialNetworkConfig(NetworkType.ChrysalisMainnet)

    if (networkConfig.nodes.length !== 0) {
        ensureOnePrimaryNode()

        networkConfig.nodes = getNodeCandidates(networkConfig)
    }

    $: {
        updateClientOptions(networkConfig)
        updateProfile('settings.networkConfig', networkConfig)
    }

    $: canRemoveAllNodes = networkConfig.nodes.length !== 0
    $: canConfigureNodes = isOfficialNetwork(networkConfig.network.type)

    $: if (nodeContextMenu && $mobile) {
        openPopup({
            type: 'nodeConfigOptions',
            props: {
                networkConfig,
                nodeContextMenu,
                ensureOnePrimaryNode,
                onPopupDestroy: onNodeConfigOptionsClose,
                handleEditNodeDetailsClick,
            },
        })
    }

    let contextPosition = { x: 0, y: 0 }
    let nodeContextMenu: Node = undefined
    let nodesContainer

    function handleIncludeOfficialNodesClick() {
        ensureValidNodeSelection()
        ensureOnePrimaryNode()
    }

    function ensureValidNodeSelection(): void {
        networkConfig.nodes = getNodeCandidates(networkConfig)
    }

    function ensureOnePrimaryNode(): void {
        networkConfig.nodes = ensureSinglePrimaryNode(networkConfig.nodes)
    }

    function handleAddNodeClick() {
        openPopup({
            type: 'addNode',
            props: {
                nodes: networkConfig.nodes,
                network: networkConfig.network,
                onSuccess: (_isNetworkSwitch: boolean, node: Node, _oldNodeUrl: string) => {
                    if (node.isPrimary) {
                        networkConfig.nodes = networkConfig.nodes.map((n) => ({ ...n, isPrimary: false }))
                    } else if (!networkConfig.nodes.some((n) => n.isPrimary)) {
                        node.isPrimary = true
                    }

                    networkConfig.nodes = [...networkConfig.nodes.filter((n) => n.url !== node.url), node]
                    if (networkConfig.nodes.length === 0) networkConfig.nodes = [node]

                    updateClientOptions(networkConfig)
                    updateProfile('settings.networkConfig', networkConfig)

                    setTimeout(() => {
                        /**
                         * NOTE: This automatically scrolls the user to the bottom of the
                         * nodes container to see the newly added node.
                         */
                        nodesContainer.scrollTop = nodesContainer.scrollHeight
                    }, 100)
                },
            },
        })
    }

    function handleRemoveAllNodesClick() {
        openPopup({
            type: 'removeNode',
            props: {
                removeAll: true,
                onSuccess: () => {
                    networkConfig.includeOfficialNodes = false
                    networkConfig.nodes = []
                },
            },
        })
    }

    function handleEditNodeDetailsClick(node) {
        openPopup({
            type: 'addNode',
            props: {
                isAddingNode: false,
                node,
                nodes: networkConfig.nodes,
                network: networkConfig.network,
                onSuccess: (_isNetworkSwitch: boolean, node: Node, oldNodeUrl: string) => {
                    const idx = networkConfig.nodes.findIndex((n) => n.url === oldNodeUrl)
                    if (idx >= 0) {
                        if (node.isPrimary) {
                            networkConfig.nodes = networkConfig.nodes.map((n) => ({
                                ...n,
                                isPrimary: n.url === oldNodeUrl,
                            }))
                        } else if (!networkConfig.nodes.some((n) => n.isPrimary)) {
                            node.isPrimary = true
                        }

                        networkConfig.nodes[idx] = node

                        updateClientOptions(networkConfig)
                        updateProfile('settings.networkConfig', networkConfig)
                    }
                },
            },
        })
    }

    function onNodeConfigOptionsClose(nodes: Node[]) {
        nodeContextMenu = undefined
        networkConfig.nodes = nodes
    }
</script>

<div>
    <Text type="h4" classes="mb-3">{localize('views.settings.networkConfiguration.title2')}</Text>
    <Text type="p" secondary classes="mb-3">
        {localize(
            `views.settings.networkConfiguration.description.${$activeProfile.isDeveloperProfile ? 'dev' : 'nonDev'}`
        )}
    </Text>
    {#if $activeProfile?.isDeveloperProfile}
        <div class="flex flex-row justify-between w-3/4">
            <div>
                <Text type="p" classes="inline" secondary>
                    {localize('views.settings.networkConfiguration.connectedTo')}:
                </Text>
                <Text type="p" highlighted>{networkConfig.network.name}</Text>
            </div>
            <div>
                <Text type="p" classes="inline" secondary>{localize('views.dashboard.network.status')}:</Text>
                <div>
                    <p class="text-13 text-{NETWORK_HEALTH_COLORS[$networkStatus.health || 0]}-500">
                        {localize(
                            `views.dashboard.network.${$networkStatus.healthText || NetworkStatusHealthText.Down}`
                        )}
                    </p>
                </div>
            </div>
        </div>
    {/if}
    {#if canConfigureNodes}
        <HR classes="pb-5 mt-5 justify-center" />
        <section id="nodeConfiguration">
            <Text type="h5" classes="mb-3">
                {localize('views.settings.networkConfiguration.nodeConfiguration.title')}
            </Text>
            <Text type="p" secondary classes="mb-5">
                {localize('views.settings.networkConfiguration.nodeConfiguration.description')}
            </Text>
            <Radio
                value={true}
                bind:group={networkConfig.automaticNodeSelection}
                label={localize('views.settings.networkConfiguration.nodeConfiguration.automatic')}
                subLabel="Connect to official nodes from the IOTA Foundation"
            />
            <Radio
                value={false}
                bind:group={networkConfig.automaticNodeSelection}
                label={localize('views.settings.networkConfiguration.nodeConfiguration.manual')}
            />
        </section>
    {/if}
    {#if !networkConfig.automaticNodeSelection}
        <HR classes="pb-5 mt-5 justify-center" />
        <section id="configureNodeList">
            <Text type="h5" classes="mb-3">{localize('views.settings.configureNodeList.title')}</Text>
            <Text type="p" secondary classes="mb-5">{localize('views.settings.configureNodeList.description')}</Text>
            {#if isOfficialNetwork(networkConfig.network.type)}
                <Checkbox
                    label={localize('views.settings.configureNodeList.includeOfficialNodeList')}
                    disabled={!canConfigureNodes}
                    bind:checked={networkConfig.includeOfficialNodes}
                    onClick={handleIncludeOfficialNodesClick}
                    classes="mb-5"
                />
            {/if}
            <div
                class="nodes-container flex flex-col border border-solid border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 rounded-2xl overflow-auto"
                bind:this={nodesContainer}
            >
                {#if networkConfig.nodes.length === 0}
                    <Text classes="p-3">
                        {localize(
                            `views.settings.configureNodeList.${
                                isOfficialNetwork(networkConfig.network.type) ? 'noNodesAuto' : 'noNodes'
                            }`
                        )}
                    </Text>
                {/if}
                {#each networkConfig.nodes as node}
                    <div
                        on:click={() => {
                            if ($mobile) nodeContextMenu = node
                        }}
                        class="flex flex-row items-center justify-between py-4 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20"
                    >
                        <div class="flex flex-row items-center space-x-4 overflow-hidden">
                            <Text
                                classes={`self-start overflow-hidden whitespace-nowrap overflow-ellipsis ${
                                    node.isDisabled ? 'opacity-50' : ''
                                }`}
                            >
                                {node.url}
                            </Text>
                            <Text
                                highlighted
                                classes={$mobile &&
                                    node.isPrimary &&
                                    'absolute right-5 p-1 -mt-1 rounded-lg bg-pastel-green'}
                            >
                                {node.isPrimary && !$mobile
                                    ? localize('views.settings.configureNodeList.primaryNode')
                                    : ''}
                            </Text>
                        </div>
                        {#if !$mobile}
                            <button
                                on:click={(e) => {
                                    nodeContextMenu = node
                                    contextPosition = { x: e.clientX, y: e.clientY }
                                }}
                                class="dark:text-white">...</button
                            >
                        {/if}
                    </div>
                {/each}
                {#if nodeContextMenu && !$mobile}
                    <NodeConfigOptions
                        bind:nodeContextMenu
                        bind:networkConfig
                        {contextPosition}
                        {ensureOnePrimaryNode}
                    />
                {/if}
            </div>
            <div class="flex flex-row justify-between space-x-3 w-full mt-4">
                <Button medium inlineStyle="min-width: 156px;" classes="w-1/2" onClick={handleAddNodeClick}>
                    {localize('actions.addNode')}
                </Button>
                <Button
                    disabled={!canRemoveAllNodes}
                    warning
                    medium
                    inlineStyle="min-width: 156px;"
                    classes="w-1/2"
                    onClick={handleRemoveAllNodesClick}
                >
                    {localize('actions.removeAllNodes')}
                </Button>
            </div>
        </section>
    {/if}
    <HR classes="pb-5 mt-5 justify-center" />
    <section id="proofOfWork">
        <Text type="h5" classes="mb-3">{localize('views.settings.proofOfWork.title')}</Text>
        <Text type="p" secondary classes="mb-5">{localize('views.settings.proofOfWork.description')}</Text>
        <Checkbox label={localize('actions.localProofOfWork')} bind:checked={networkConfig.localPow} />
    </section>
</div>

<style type="text/scss">
    .nodes-container {
        max-height: 338px;
    }
</style>
