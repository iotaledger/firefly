<script lang="typescript">
    import { Button,Checkbox,HR,Radio,Text } from 'shared/components'
    import { clickOutside } from 'shared/lib/actions'
    import { loggedIn } from 'shared/lib/app'
    import { appSettings } from 'shared/lib/appSettings'
    import { Electron } from 'shared/lib/electron'
    import { navigateToNewIndexMigration } from 'shared/lib/ledger'
    import {
    ensureSinglePrimaryNode,getNodeCandidates,
    getOfficialNetworkConfig,
    getOfficialNodes,
    isOfficialNetwork,
    updateClientOptions
    } from 'shared/lib/network'
    import { networkStatus,NETWORK_HEALTH_COLORS } from 'shared/lib/networkStatus'
    import { openPopup } from 'shared/lib/popup'
    import { activeProfile,isLedgerProfile,updateProfile } from 'shared/lib/profile'
    import type { Locale } from 'shared/lib/typings/i18n'
    import { NetworkConfig,NetworkStatusHealthText,NetworkType } from 'shared/lib/typings/network'
    import type { Node } from 'shared/lib/typings/node'
    import { wallet } from 'shared/lib/wallet'
    import { get } from 'svelte/store'

    export let locale: Locale

    let deepLinkingChecked = $appSettings.deepLinking

    let showHiddenAccounts = $activeProfile?.settings.showHiddenAccounts

    const networkConfig: NetworkConfig = get(activeProfile)?.settings.networkConfig || getOfficialNetworkConfig(NetworkType.ChrysalisMainnet)

    if (networkConfig.nodes.length !== 0) {
        ensureOnePrimaryNode()

        networkConfig.nodes = getNodeCandidates(networkConfig)
    }

    $: $appSettings.deepLinking = deepLinkingChecked
    $: $appSettings.deepLinking && Electron.DeepLinkManager.checkDeepLinkRequestExists()

    $: updateProfile('settings.showHiddenAccounts', showHiddenAccounts)
    $: {
        updateClientOptions(networkConfig)
        updateProfile('settings.networkConfig', networkConfig)
    }

    $: canRemoveAllNodes = networkConfig.nodes.length !== 0
    $: canConfigureNodes = isOfficialNetwork(networkConfig.network.type)

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

    function handleSetPrimaryNode(node: Node) {
        networkConfig.nodes = networkConfig.nodes.map((n) => ({ ...n, isPrimary: n.url === node.url }))
        nodeContextMenu = undefined
    }

    function handleAddNodeClick() {
        openPopup({
            type: 'addNode',
            props: {
                nodes: networkConfig.nodes,
                network: networkConfig.network,
                onSuccess: (_isNetworkSwitch: boolean, node: Node, _oldNodeUrl: string) => {
                    if(node.isPrimary) {
                        networkConfig.nodes = networkConfig.nodes.map((n) => ({ ...n, isPrimary: false }))
                    } else if (!networkConfig.nodes.some((n) => n.isPrimary)) {
                        node.isPrimary = true
                    }

                    networkConfig.nodes = [...networkConfig.nodes.filter((n) => n.url !== node.url), node]
                    if(networkConfig.nodes.length === 0) networkConfig.nodes = [node]

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
                        if(node.isPrimary) {
                            networkConfig.nodes = networkConfig.nodes.map((n) => ({ ...n, isPrimary: n.url === oldNodeUrl }))
                        } else if (!networkConfig.nodes.some((n) => n.isPrimary)) {
                            node.isPrimary = true
                        }

                        networkConfig.nodes[idx] = node
                    }
                },
            },
        })
    }

    function handleViewNodeInfoClick(node: Node) {
        openPopup({
            type: 'nodeInfo',
            props: {
                node
            }
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

    function handleRemoveAllNodesClick() {
        openPopup({
            type: 'removeNode',
            props: {
                removeAll: true,
                onSuccess: () => {
                    networkConfig.includeOfficialNodes = false
                    networkConfig.nodes = []
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
</script>

<style type="text/scss">
    .nodes-container {
        max-height: 338px;
    }
</style>

<div>
    {#if $loggedIn}
        <section id="networkConfiguration">
            <Text type="h4" classes="mb-3">{locale('views.settings.networkConfiguration.title2')}</Text>
            <Text type="p" secondary classes="mb-3">
                {locale(`views.settings.networkConfiguration.description.${$activeProfile.isDeveloperProfile ? 'dev' : 'nonDev'}`)}
            </Text>
            {#if $activeProfile?.isDeveloperProfile}
                <div class="flex flex-row justify-between w-3/4">
                    <div>
                        <Text type="p" classes="inline" secondary>
                            {locale('views.settings.networkConfiguration.connectedTo')}:
                        </Text>
                        <Text type="p" highlighted>{networkConfig.network.name}</Text>
                    </div>
                    <div>
                        <Text type="p" classes="inline" secondary>{locale('views.dashboard.network.status')}:</Text>
                        <div>
                            <p class="text-13 text-{NETWORK_HEALTH_COLORS[$networkStatus.health || 0]}-500">
                                {locale(`views.dashboard.network.${$networkStatus.healthText || NetworkStatusHealthText.Down}`)}
                            </p>
                        </div>
                    </div>
                </div>
            {/if}
        </section>
        <HR classes="pb-5 mt-5 justify-center" />
        {#if canConfigureNodes}
            <section id="nodeConfiguration">
                <Text type="h5" classes="mb-3">
                    {locale('views.settings.networkConfiguration.nodeConfiguration.title')}
                </Text>
                <Text type="p" secondary classes="mb-5">
                    {locale('views.settings.networkConfiguration.nodeConfiguration.description')}
                </Text>
                <Radio
                    value={true}
                    bind:group={networkConfig.automaticNodeSelection}
                    label={locale('views.settings.networkConfiguration.nodeConfiguration.automatic')}
                    subLabel="Connect to official nodes from the IOTA Foundation" />
                <Radio
                    value={false}
                    bind:group={networkConfig.automaticNodeSelection}
                    label={locale('views.settings.networkConfiguration.nodeConfiguration.manual')} />
            </section>
            <HR classes="pb-5 mt-5 justify-center" />
        {/if}
        {#if !networkConfig.automaticNodeSelection}
            <section id="configureNodeList">
                <Text type="h5" classes="mb-3">{locale('views.settings.configureNodeList.title')}</Text>
                <Text type="p" secondary classes="mb-5">{locale('views.settings.configureNodeList.description')}</Text>
                {#if isOfficialNetwork(networkConfig.network.type)}
                    <Checkbox
                        label={locale('views.settings.configureNodeList.includeOfficialNodeList')}
                        disabled={!canConfigureNodes}
                        bind:checked={networkConfig.includeOfficialNodes}
                        onClick={handleIncludeOfficialNodesClick}
                        classes="mb-5" />
                {/if}
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
                                    classes={`self-start overflow-hidden whitespace-nowrap overflow-ellipsis ${node.isDisabled ? 'opacity-50' : ''}`}>
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
                                <button
                                    on:click={() => {
                                        handleViewNodeInfoClick(nodeContextMenu)
                                        nodeContextMenu = undefined
                                    }}
                                    class="flex p-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20">
                                    <Text smaller>{locale('views.settings.configureNodeList.viewInfo')}</Text>
                                </button>
                            {/if}
                            {#if !getOfficialNodes(networkConfig.network.type)
                                .map((n) => n.url)
                                .includes(nodeContextMenu.url)}
                                <button
                                    on:click={() => {
                                        handleEditNodeDetailsClick(nodeContextMenu)
                                        nodeContextMenu = undefined
                                    }}
                                    class="flex p-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20">
                                    <Text smaller>{locale('views.settings.configureNodeList.editDetails')}</Text>
                                </button>
                            {/if}
                            {#if nodeContextMenu.url !== networkConfig.nodes.find((n) => n.isPrimary)?.url}
                                <button
                                    on:click={() => {
                                        nodeContextMenu.isDisabled = !nodeContextMenu.isDisabled
                                        networkConfig.nodes = networkConfig.nodes.map((n) => ({
                                            ...n,
                                            isDisabled: n.url === nodeContextMenu.url && nodeContextMenu.isDisabled,
                                        }))
                                        nodeContextMenu = undefined
                                    }}
                                    class="flex p-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20">
                                    <Text smaller>
                                        {locale(nodeContextMenu.isDisabled ? 'views.settings.configureNodeList.includeNode' : 'views.settings.configureNodeList.excludeNode')}
                                    </Text>
                                </button>
                            {/if}
                            {#if !getOfficialNodes(networkConfig.network.type)
                                .map((n) => n.url)
                                .includes(nodeContextMenu.url)}
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
                    <Button
                        disabled={!canRemoveAllNodes}
                        warning
                        medium
                        inlineStyle="min-width: 156px;"
                        classes="w-1/2"
                        onClick={handleRemoveAllNodesClick}>
                        {locale('actions.removeAllNodes')}
                    </Button>
                </div>
            </section>
            <HR classes="pb-5 mt-5 justify-center" />
        {/if}
        <section id="proofOfWork" class="w-3/4">
            <Text type="h5" classes="mb-3">{locale('views.settings.proofOfWork.title')}</Text>
            <Text type="p" secondary classes="mb-5">{locale('views.settings.proofOfWork.description')}</Text>
            <Checkbox label={locale('actions.localProofOfWork')} bind:checked={networkConfig.localPow} />
        </section>
        <HR classes="pb-5 mt-5 justify-center" />
    {/if}
    <section id="deepLinks" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.deepLinks.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.deepLinks.description')}</Text>
        <Checkbox label={locale('actions.enableDeepLinks')} bind:checked={deepLinkingChecked} />
        <HR classes="pb-5 mt-5 justify-center" />
    </section>
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
</div>
