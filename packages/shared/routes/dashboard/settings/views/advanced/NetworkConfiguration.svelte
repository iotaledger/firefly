<script lang="typescript">
    import { Button, Checkbox, HR, Radio, Text, NodeConfigOptions } from 'shared/components'
    import { localize } from '@core/i18n'
    import {
        getNodeCandidates,
        isOfficialNetwork,
        updateClientOptions,
        INode,
        NETWORK_HEALTH_COLORS,
        NetworkStatusDescription,
        networkStatus,
        NetworkHealth,
        getOfficialNodes,
        nodeInfo,
        NetworkType,
    } from '@core/network'
    import { closePopup, openPopup } from '@lib/popup'
    import { activeProfile, updateActiveProfile } from '@core/profile'

    let contextPosition = { x: 0, y: 0 }
    let nodeContextMenu: INode
    let nodesContainer

    $: clientOptions = $activeProfile?.clientOptions

    $: {
        updateClientOptions(clientOptions)
        updateActiveProfile({ clientOptions })
        if (clientOptions?.nodes.length !== 0) {
            clientOptions.nodes = getNodeCandidates(clientOptions)
        }
    }

    function handleIncludeOfficialNodesClick() {
        ensureValidNodeSelection()
    }

    function ensureValidNodeSelection(): void {
        clientOptions.nodes = getNodeCandidates(clientOptions)
    }

    function handleAddNodeClick(): void {
        openPopup({
            type: 'addNode',
            props: {
                onSuccess: () => {
                    closePopup()
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

    function handleRemoveAllNodesClick(): void {
        openPopup({
            type: 'removeNode',
            props: {
                removeAll: true,
                onSuccess: () => {
                    clientOptions.includeOfficialNodes = false
                    clientOptions.nodes = []
                },
            },
        })
    }

    function handleManualNodeSelection() {
        clientOptions.includeOfficialNodes = true
    }
</script>

<div>
    <Text type="h4" classes="mb-3">{localize('views.settings.networkConfiguration.title2')}</Text>
    <Text type="p" secondary classes="mb-3">
        {localize(
            `views.settings.networkConfiguration.description.${$activeProfile?.isDeveloperProfile ? 'dev' : 'nonDev'}`
        )}
    </Text>
    {#if $activeProfile?.isDeveloperProfile}
        <div class="flex flex-row justify-between w-3/4">
            <div>
                <Text type="p" classes="inline" secondary>
                    {localize('views.settings.networkConfiguration.connectedTo')}:
                </Text>
                <Text type="p" highlighted>{$nodeInfo?.protocol?.networkName}</Text>
            </div>
            <div>
                <Text type="p" classes="inline" secondary>{localize('views.dashboard.network.status')}:</Text>
                <div>
                    <p class="text-13 text-{NETWORK_HEALTH_COLORS[$networkStatus.health || 0]}-500">
                        {localize(
                            `views.dashboard.network.${
                                $networkStatus.description || NetworkStatusDescription[NetworkHealth.Disconnected]
                            }`
                        )}
                    </p>
                </div>
            </div>
        </div>
    {/if}
    <HR classes="pb-5 mt-5 justify-center" />
    {#if $activeProfile.networkType === NetworkType.Mainnet}
        <section id="nodeConfiguration">
            <Text type="h5" classes="mb-3">
                {localize('views.settings.networkConfiguration.nodeConfiguration.title')}
            </Text>
            <Text type="p" secondary classes="mb-5">
                {localize('views.settings.networkConfiguration.nodeConfiguration.description')}
            </Text>
            <Radio
                value={true}
                bind:group={clientOptions.automaticNodeSelection}
                label={localize('views.settings.networkConfiguration.nodeConfiguration.automatic')}
                subLabel="Connect to official nodes from the IOTA Foundation"
            />
            <Radio
                value={false}
                bind:group={clientOptions.automaticNodeSelection}
                label={localize('views.settings.networkConfiguration.nodeConfiguration.manual')}
                on:change={handleManualNodeSelection}
            />
        </section>
        <HR classes="pb-5 mt-5 justify-center" />
    {/if}
    {#if !clientOptions.automaticNodeSelection}
        <section id="configureNodeList">
            <Text type="h5" classes="mb-3">{localize('views.settings.configureNodeList.title')}</Text>
            <Text type="p" secondary classes="mb-5">{localize('views.settings.configureNodeList.description')}</Text>
            {#if isOfficialNetwork($activeProfile?.networkType) && !clientOptions.automaticNodeSelection}
                <Checkbox
                    label={localize('views.settings.configureNodeList.includeOfficialNodeList')}
                    bind:checked={clientOptions.includeOfficialNodes}
                    onClick={handleIncludeOfficialNodesClick}
                    classes="mb-5"
                />
            {/if}
            <div
                class="nodes-container flex flex-col border border-solid border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 rounded-2xl overflow-auto"
                bind:this={nodesContainer}
            >
                {#if clientOptions.nodes.length === 0 && !isOfficialNetwork($activeProfile.networkType)}
                    <Text classes="p-3">
                        {localize('views.settings.configureNodeList.noNodes')}
                    </Text>
                {:else}
                    {#each clientOptions.nodes.length === 0 ? getOfficialNodes($activeProfile.networkProtocol, $activeProfile.networkType) : clientOptions.nodes as node}
                        <div
                            class="flex flex-row items-center justify-between py-4 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20"
                        >
                            <div class="flex flex-row items-center space-x-4 overflow-hidden">
                                <Text classes={'self-start overflow-hidden whitespace-nowrap overflow-ellipsis'}>
                                    {node.url}
                                </Text>
                            </div>
                            <button
                                on:click={(e) => {
                                    nodeContextMenu = node
                                    contextPosition = { x: e.clientX, y: e.clientY }
                                }}
                                class="dark:text-white">...</button
                            >
                        </div>
                    {/each}
                {/if}
                {#if nodeContextMenu}
                    <NodeConfigOptions bind:nodeContextMenu bind:clientOptions {contextPosition} />
                {/if}
            </div>
            {#if !clientOptions.automaticNodeSelection}
                <div class="flex flex-row justify-between space-x-3 w-full mt-4">
                    <Button medium inlineStyle="min-width: 156px;" classes="w-1/2" onClick={handleAddNodeClick}>
                        {localize('actions.addNode')}
                    </Button>
                    <Button
                        disabled={$activeProfile?.networkType === NetworkType.PrivateNet ||
                            clientOptions?.nodes.length <= 1}
                        warning
                        medium
                        inlineStyle="min-width: 156px;"
                        classes="w-1/2"
                        onClick={handleRemoveAllNodesClick}
                    >
                        {localize('actions.removeAllNodes')}
                    </Button>
                </div>
            {/if}
        </section>
        <HR classes="pb-5 mt-5 justify-center" />
    {/if}
    <section id="proofOfWork">
        <Text type="h5" classes="mb-3">{localize('views.settings.proofOfWork.title')}</Text>
        <Text type="p" secondary classes="mb-5">{localize('views.settings.proofOfWork.description')}</Text>
        <Checkbox label={localize('actions.localProofOfWork')} bind:checked={clientOptions.localPow} />
    </section>
</div>

<style type="text/scss">
    .nodes-container {
        max-height: 338px;
    }
</style>
