<script lang="typescript">
    import { Button, Checkbox, HR, Radio, Text } from 'shared/components'
    import { clickOutside } from 'shared/lib/actions'
    import { loggedIn } from 'shared/lib/app'
    import { appSettings } from 'shared/lib/appSettings'
    import { navigateToNewIndexMigration } from 'shared/lib/ledger'
    import {
        getOfficialNodes,
        isOfficialNetwork,
        updateClientOptions,
    } from 'shared/lib/network'
    import { openPopup } from 'shared/lib/popup'
    import { activeProfile, isLedgerProfile, updateProfile } from 'shared/lib/profile'
    import { asyncSyncAccounts, getSyncAccountOptions, wallet } from 'shared/lib/wallet'
    import { Locale } from 'shared/lib/typings/i18n'
    import { Node } from 'shared/lib/typings/node'
    import { NetworkConfig, NetworkType } from 'shared/lib/typings/network'
    import { onDestroy } from 'svelte'
    import { networkStatus } from 'shared/lib/networkStatus'
    import { showAppNotification } from 'shared/lib/notifications'

    export let locale: Locale

    const deepLinkingChecked = $appSettings.deepLinking

    let showHiddenAccounts = $activeProfile?.settings.showHiddenAccounts

    const networkStatusInt = 2
    let networkStatusText = 'networkOperational'
    let networkMps = 0
    let networkRate = 0

    const unsubscribe = networkStatus.subscribe((data) => {
        networkStatusText = networkStatusInt === 0 ? 'networkDown' : networkStatusInt === 1 ? 'networkDegraded' : 'networkOperational'
        networkMps = data.messagesPerSecond ?? 0
        networkRate = data.referencedRate ?? 0
    })

    const NETWORK_HEALTH_COLORS = {
        0: 'red',
        1: 'yellow',
        2: 'green',
    }

    let networkConfig: NetworkConfig
    $: networkConfig = $activeProfile.settings.networkConfig
    $: {
        ensureOnePrimaryNode()
        updateProfile('settings.networkConfig', networkConfig)
        updateClientOptions(networkConfig)
    }

    let canRemoveAllNodes
    $: {
        if(networkConfig.nodes.length === 0) {
            canRemoveAllNodes = false
        } else {
            if(networkConfig.includeOfficialNodes) {
                canRemoveAllNodes = networkConfig.nodes.length !== getOfficialNodes(networkConfig.network.type).length
            } else {
                canRemoveAllNodes = true
            }
        }
    }

    let canConfigureNodes
    $: {
        canConfigureNodes = isOfficialNetwork(networkConfig.network.type)
    }

    $: updateProfile('settings.showHiddenAccounts', showHiddenAccounts)

    let contextPosition = { x: 0, y: 0 }
    let nodeContextMenu: Node = undefined
    let nodesContainer

    const { accounts } = $wallet

    let hasTransactions = false
    if ($loggedIn && $accounts) {
        for (const account of $accounts) {
            if (account.messages.length > 0) {
                hasTransactions = true
            }
        }
    }

    function ensureOfficialNodeSelection(): void {
        const nonOfficialNodes =
            networkConfig.nodes.filter((n) => !getOfficialNodes(networkConfig.network.type).map((n1) => n1.url).includes(n.url))
        if(networkConfig.includeOfficialNodes) {
            networkConfig.nodes = [...getOfficialNodes(networkConfig.network.type, false), ...nonOfficialNodes]
        } else {
            networkConfig.nodes = nonOfficialNodes
        }
    }

    function ensureOnePrimaryNode(): void {
        const numPrimaryNodes = networkConfig.nodes.filter((n) => n.isPrimary).length
        if(numPrimaryNodes !== 1) {
            if(numPrimaryNodes > 1) {
                const activeNode = networkConfig.nodes.find((n) => n.isPrimary)
                networkConfig.nodes = networkConfig.nodes.map((n, idx) => ({ ...n, isPrimary: n.url === activeNode.url }))
            } else {
                const randIdx = Math.floor(Math.random() * networkConfig.nodes.length)
                networkConfig.nodes = networkConfig.nodes.map((n, idx) => ({ ...n, isPrimary: idx === randIdx}))
            }
        }
    }

    function handleIncludeOfficialNodesClick() {
        ensureOfficialNodeSelection()
        ensureOnePrimaryNode()
    }

    function handleAddNodeClick() {
        openPopup({
            type: 'addNode',
            props: {
                nodes: networkConfig.nodes,
                network: networkConfig.network,
                onSuccess: (shouldSwitchNetworks: boolean, node: Node) => {
                    if(node.isPrimary) {
                        networkConfig.nodes = networkConfig.nodes.map((n) => ({ ...n, isPrimary: false }))
                    }

                    const primaryNode = node.isPrimary ? node : networkConfig.nodes.some((n) => n.isPrimary)
                    if (!primaryNode) {
                        node.isPrimary = true
                    }

                    networkConfig.network = shouldSwitchNetworks ? node.network : networkConfig.network
                    networkConfig.nodes = [...networkConfig.nodes.filter((n) => n.url !== node.url), node]
                    if(networkConfig.nodes.length === 0) networkConfig.nodes = [node]

                    updateClientOptions(networkConfig)
                    updateProfile('settings.networkConfig', networkConfig)

                    if(shouldSwitchNetworks) {
                        const { gapLimit, accountDiscoveryThreshold } = getSyncAccountOptions(false)
                        void asyncSyncAccounts(0, gapLimit, accountDiscoveryThreshold)

                        showAppNotification({
                            type: 'info',
                            message: locale('views.settings.networkConfiguration.switchedNetworks', { values: { networkName: networkConfig.network.name }})
                        })
                    }

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

    function handlePropertiesNodeClick(node) {
        openPopup({
            type: 'addNode',
            props: {
                node,
                nodes: networkConfig.nodes,
                network: networkConfig.network,
                onSuccess: (updatedNode: Node) => {
                    const idx = networkConfig.nodes.findIndex((n) => n.url === updatedNode.url)
                    if (idx >= 0) {
                        // If there are no other primary nodes for this network then auto select this one
                        const networkNodes = networkConfig.nodes
                        const primaryNode = networkNodes.some((n) => n.isPrimary)
                        if (!primaryNode) {
                            updatedNode.isPrimary = true
                        }

                        networkConfig.nodes[idx] = updatedNode
                    }
                },
            },
        })
    }

    function handleSetPrimaryNode(node: Node) {
        networkConfig.nodes = networkConfig.nodes.map((n) => ({ ...n, isPrimary: n.url === node.url }))
        nodeContextMenu = undefined
    }

    function handleRemoveNodeClick(node) {
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

    function handleRemoveAllNodesClick() {
        openPopup({
            type: 'removeNode',
            props: {
                removeAll: true,
                onSuccess: () => {
                    networkConfig.nodes = networkConfig.includeOfficialNodes
                        ? getOfficialNodes(networkConfig.network.type)
                        : []

                    ensureOnePrimaryNode()
                }
            }
        })
    }

    function handleErrorLogClick() {
        openPopup({ type: 'errorLog' })
    }

    function handleDiagnosticsClick() {
        openPopup({ type: 'diagnostics' })
    }

    function handleBalanceFinderClick() {
        openPopup({ type: 'balanceFinder', hideClose: true })
    }

    onDestroy(() => {
        unsubscribe()
    })
</script>

<style type="text/scss">
    .nodes-container {
        max-height: 338px;
    }
</style>

<div>
    {#if $loggedIn}
        <section id="networkConfiguration">
            <Text type="h4" classes="mb-3">{locale('views.settings.networkConfiguration.title')}</Text>
            <Text type="p" secondary classes="mb-3">{locale(`views.settings.networkConfiguration.description.${$activeProfile.isDeveloperProfile ? 'dev' : 'nonDev'}`)}</Text>
            <div class="flex flex-row justify-between w-3/4">
                <div>
                    <Text type="p" classes="inline" secondary>{locale('views.settings.networkConfiguration.connectedTo')}:</Text>
                    <Text type="p" highlighted>{networkConfig.network.name}</Text>
                </div>
                <div>
                    <Text type="p" classes="inline" secondary>{locale('views.dashboard.network.status')}:</Text>
                    <div>
                        <p class="text-13 text-{NETWORK_HEALTH_COLORS[networkStatusInt]}-500">
                            {locale(`views.dashboard.network.${networkStatusText}`)}
                        </p>
                    </div>
                </div>
            </div>
        </section>
        <HR classes="pb-5 mt-5 justify-center" />
        {#if canConfigureNodes}
            <section id="nodeConfiguration">
                <Text type="h5" classes="mb-3">{locale('views.settings.networkConfiguration.nodeConfiguration.title')}</Text>
                <Text type="p" secondary classes="mb-5">{locale('views.settings.networkConfiguration.nodeConfiguration.description')}</Text>
                <Radio value={true} bind:group={networkConfig.automaticNodeSelection} label={locale('views.settings.networkConfiguration.nodeConfiguration.automatic')} subLabel='Connect to official nodes from the IOTA Foundation' />
                <Radio value={false} bind:group={networkConfig.automaticNodeSelection} label={locale('views.settings.networkConfiguration.nodeConfiguration.manual')} />
            </section>
            <HR classes="pb-5 mt-5 justify-center" />
        {/if}
        {#if !networkConfig.automaticNodeSelection}
            <section id="configureNodeList">
                <Text type="h5" classes="mb-3">{locale('views.settings.configureNodeList.title')}</Text>
                <Text type="p" secondary classes="mb-5">{locale('views.settings.configureNodeList.description')}</Text>
                <Checkbox
                    label={locale('views.settings.configureNodeList.includeOfficialNodeList')}
                    disabled={!canConfigureNodes}
                    bind:checked={networkConfig.includeOfficialNodes}
                    onClick={handleIncludeOfficialNodesClick}
                    classes="mb-5" />
                <div
                    class="nodes-container flex flex-col border border-solid border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 rounded-2xl overflow-auto"
                    bind:this={nodesContainer}>
                    {#if networkConfig.nodes.length === 0}
                        <Text classes="p-3">
                            {locale(`views.settings.configureNodeList.${isOfficialNetwork(networkConfig.network.type) ? 'noNodesAuto' : 'noNodes'}`)}
                        </Text>
                    {/if}
                    {#each networkConfig.nodes as node}
                        <div
                            class="flex flex-row items-center justify-between py-4 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20">
                            <div class="flex flex-row items-center overflow-hidden">
                                <Text
                                    classes={`overflow-hidden whitespace-nowrap overflow-ellipsis ${node.isDisabled ? 'opacity-50' : ''}`}>
                                    {node.url}
                                </Text>
                                <Text highlighted classes="mx-4">
                                    {node.isPrimary ? locale('views.settings.configureNodeList.primaryNode') : ''}
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
                            {#if !nodeContextMenu.isDisabled}
                                <button
                                    on:click={() => handleSetPrimaryNode(nodeContextMenu)}
                                    class="flex p-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20">
                                    <Text smaller>{locale('views.settings.configureNodeList.setAsPrimary')}</Text>
                                </button>
                            {/if}
                            {#if !getOfficialNodes(networkConfig.network.type).map((n) => n.url).includes(nodeContextMenu.url)}
                                <button
                                    on:click={() => {
                                        handlePropertiesNodeClick(nodeContextMenu)
                                        nodeContextMenu = undefined
                                    }}
                                    class="flex p-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20">
                                    <Text smaller>{locale('views.settings.configureNodeList.viewDetails')}</Text>
                                </button>
                            {/if}
                            {#if nodeContextMenu.url !== networkConfig.nodes.find((n) => n.isPrimary).url}
                                <button
                                    on:click={() => {
                                        nodeContextMenu.isDisabled = !nodeContextMenu.isDisabled
                                        networkConfig.nodes
                                            = networkConfig.nodes.map((n) => ({ ...n, isDisabled: (n.url === nodeContextMenu.url && nodeContextMenu.isDisabled) }))
                                        nodeContextMenu = undefined
                                    }}
                                    class="flex p-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20">
                                    <Text smaller>
                                        {locale(nodeContextMenu.isDisabled ? 'views.settings.configureNodeList.includeNode' : 'views.settings.configureNodeList.excludeNode')}
                                    </Text>
                                </button>
                            {/if}
                            {#if !getOfficialNodes(networkConfig.network.type).map((n) => n.url).includes(nodeContextMenu.url)}
                                <HR />
                                <button
                                    on:click={() => {
                                        handleRemoveNodeClick(nodeContextMenu)
                                        nodeContextMenu = undefined
                                    }}
                                    class="flex p-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20">
                                    <Text smaller error>{locale('views.settings.configureNodeList.removeNode')}</Text>
                                </button>
                            {/if}
                        </div>
                    {/if}
                </div>
                <div class="flex flex-row justify-between space-x-3 w-full mt-4">
                    <Button medium inlineStyle="min-width: 156px;" classes="w-1/2" onClick={handleAddNodeClick}>
                        {locale('actions.addNode')}
                    </Button>
                    <Button disabled={!canRemoveAllNodes} warning medium inlineStyle="min-width: 156px;" classes="w-1/2" onClick={handleRemoveAllNodesClick}>
                        {locale('actions.removeAllNodes')}
                    </Button>
                </div>
            </section>
            <HR classes="pb-5 mt-5 justify-center" />
        {/if}
        <section id="proofOfWork" class="w-3/4">
            <Text type="h4" classes="mb-3">{locale('views.settings.proofOfWork.title')}</Text>
            <Text type="p" secondary classes="mb-5">{locale('views.settings.proofOfWork.description')}</Text>
            <Checkbox label={locale('actions.localProofOfWork')} bind:checked={networkConfig.localPow} />
        </section>
        <HR classes="pb-5 mt-5 justify-center" />
    {/if}
    <!-- TODO: re-enable deep links -->
    <!-- <section id="deepLinks" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.deepLinks.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.deepLinks.description')}</Text>
        <Checkbox label={locale('actions.enableDeepLinks')} bind:checked={deepLinkingChecked} />
        <HR classes="pb-5 mt-5 justify-center" />
    </section> -->
    {#if $loggedIn}
        <section id="balanceFinder" class="w-3/4">
            <Text type="h4" classes="mb-3">{locale('views.settings.balanceFinder.title')}</Text>
            <Text type="p" secondary classes="mb-5">{locale('views.settings.balanceFinder.description')}</Text>
            <div class="flex flex-row items-center">
                <Button medium inlineStyle="min-width: 156px;" onClick={() => handleBalanceFinderClick()}>
                    {locale('actions.findBalances')}
                </Button>
            </div>
        </section>
        <HR classes="pb-5 mt-5 justify-center" />
        <section id="hiddenAccounts" class="w-3/4">
            <Text type="h4" classes="mb-3">{locale('views.settings.hiddenAccounts.title')}</Text>
            <Text type="p" secondary classes="mb-5">{locale('views.settings.hiddenAccounts.description')}</Text>
            <Checkbox label={locale('actions.showHiddenAccounts')} bind:checked={showHiddenAccounts} />
        </section>
    {/if}
    <HR classes="pb-5 mt-5 justify-center" />
    <section id="errorLog" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.errorLog.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.errorLog.description')}</Text>
        <Button medium inlineStyle="min-width: 156px;" onClick={() => handleErrorLogClick()}>
            {locale('views.settings.errorLog.title')}
        </Button>
    </section>
    <HR classes="pb-5 mt-5 justify-center" />
    <section id="diagnostics" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.diagnostics.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.diagnostics.description')}</Text>
        <Button medium inlineStyle="min-width: 156px;" onClick={() => handleDiagnosticsClick()}>
            {locale('views.settings.diagnostics.title')}
        </Button>
    </section>
    {#if $isLedgerProfile}
        <HR classes="pb-5 mt-5 justify-center" />
        <section id="migrateLedgerIndex" class="w-3/4">
            <Text type="h4" classes="mb-3">{locale('views.settings.migrateLedgerIndex.title')}</Text>
            <Text type="p" secondary classes="mb-5">{locale('views.settings.migrateLedgerIndex.description')}</Text>
            <Button medium inlineStyle="min-width: 156px;" onClick={() => navigateToNewIndexMigration()}>
                {locale('views.settings.migrateLedgerIndex.title')}
            </Button>
        </section>
    {/if}
    <!-- TODO: Implement state export -->
    <!-- {#if $loggedIn}
    <HR classes="pb-5 mt-5 justify-center" />
    <section id="stateExport" class="w-3/4 opacity-50">
        <Text type="h4" classes="mb-3">{locale('views.settings.stateExport.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.stateExport.description')}</Text>
        <Button medium inlineStyle="min-width: 156px;" disabled onClick={() => {}}>{locale('actions.exportState')}</Button>
    </section>
    {/if} -->
</div>
