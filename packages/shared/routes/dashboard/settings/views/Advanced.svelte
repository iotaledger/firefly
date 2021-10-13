<script lang="typescript">
    import { Button, Checkbox, HR, Radio, Text } from 'shared/components'
    import { clickOutside } from 'shared/lib/actions'
    import { loggedIn } from 'shared/lib/app'
    import { appSettings } from 'shared/lib/appSettings'
    import { navigateToNewIndexMigration } from 'shared/lib/ledger'
    import { getOfficialNodes } from 'shared/lib/network'
    import { openPopup } from 'shared/lib/popup'
    import { activeProfile, isLedgerProfile, updateProfile } from 'shared/lib/profile'
    import { buildAccountNetworkSettings, updateAccountNetworkSettings } from 'shared/lib/wallet'
    import { get } from 'svelte/store'
    import { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale

    const deepLinkingChecked = $appSettings.deepLinking

    const isDeveloperProfile = get(activeProfile)?.isDeveloperProfile
    let showHiddenAccounts = get(activeProfile)?.settings.showHiddenAccounts

    let { automaticNodeSelection, includeOfficialNodes, nodes, primaryNodeUrl, localPow } = buildAccountNetworkSettings()

    let contextPosition = { x: 0, y: 0 }
    let nodeContextMenu = undefined
    let nodesContainer

    $: $appSettings.deepLinking = deepLinkingChecked

    const handleDiagnosticReporting = (diagnosticReporting) => {
        // TODO: Update the JSON settings file (put this function in one common place for App.svelte too!)
    }

    $: handleDiagnosticReporting($appSettings.diagnosticReporting)

    $: updateProfile('settings.showHiddenAccounts', showHiddenAccounts)
    $: updateProfile('isDeveloperProfile', isDeveloperProfile)

    $: {
        const officialNodes = getOfficialNodes()
        const nonOfficialNodes = nodes.filter((n) => !officialNodes.find((d) => d.url === n.url))

        if (includeOfficialNodes) {
            nodes = [...officialNodes, ...nonOfficialNodes]
        } else {
            nodes = [...nonOfficialNodes]
        }

        const allEnabled = nodes.filter((n) => !n.disabled)
        const primaryNode = allEnabled.find((n) => n.url === primaryNodeUrl)
        if (!primaryNode && allEnabled.length > 0) {
            primaryNodeUrl = allEnabled[0].url
        }
    }
    $: void updateAccountNetworkSettings(automaticNodeSelection, includeOfficialNodes, nodes, primaryNodeUrl, localPow)

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
        <section id="nodeSettings" class="w-3/4">
            <Text type="h4" classes="mb-3">{locale('views.settings.nodeSettings.title')}</Text>
            <Text type="p" secondary classes="mb-5">{locale('views.settings.nodeSettings.description')}</Text>
            <Radio value={true} bind:group={automaticNodeSelection} label={locale('general.automaticNodeSelection')} />
            <Radio value={false} bind:group={automaticNodeSelection} label={locale('general.manualNodeSelection')} />
        </section>
        <HR classes="pb-5 mt-5 justify-center" />
        {#if !automaticNodeSelection}
            <section id="configureNodeList">
                <Text type="h4" classes="mb-3">{locale('views.settings.configureNodeList.title')}</Text>
                <Text type="p" secondary classes="mb-5">{locale('views.settings.configureNodeList.description')}</Text>
                <Checkbox
                    label={locale('views.settings.configureNodeList.includeOfficialNodeList')}
                    bind:checked={includeOfficialNodes}
                    classes="mb-5" />
                <div
                    class="nodes-container flex flex-col border border-solid border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 rounded-2xl overflow-auto"
                    bind:this={nodesContainer}>
                    {#if nodes.length === 0}
                        <Text classes="p-3">{locale('views.settings.configureNodeList.noNodes')}</Text>
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
                                    {node.url === primaryNodeUrl ? locale('views.settings.configureNodeList.primaryNode') : ''}
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
                                    <Text smaller>{locale('views.settings.configureNodeList.setAsPrimary')}</Text>
                                </button>
                            {/if}
                            {#if nodeContextMenu.isCustom}
                                <button
                                    on:click={() => {
                                        handlePropertiesNodeClick(nodeContextMenu)
                                        nodeContextMenu = undefined
                                    }}
                                    class="flex p-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20">
                                    <Text smaller>{locale('views.settings.configureNodeList.viewDetails')}</Text>
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
                                        {locale(nodeContextMenu.disabled ? 'views.settings.configureNodeList.includeNode' : 'views.settings.configureNodeList.excludeNode')}
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
                                    <Text smaller error>{locale('views.settings.configureNodeList.removeNode')}</Text>
                                </button>
                            {/if}
                        </div>
                    {/if}
                </div>
                <Button medium inlineStyle="min-width: 156px;" classes="w-1/4 mt-4" onClick={() => handleAddNodeClick()}>
                    {locale('actions.addNode')}
                </Button>
            </section>
            <HR classes="pb-5 mt-5 justify-center" />
        {/if}
        <section id="proofOfWork" class="w-3/4">
            <Text type="h4" classes="mb-3">{locale('views.settings.proofOfWork.title')}</Text>
            <Text type="p" secondary classes="mb-5">{locale('views.settings.proofOfWork.description')}</Text>
            <Checkbox label={locale('actions.localProofOfWork')} bind:checked={localPow} />
        </section>
        <HR classes="pb-5 mt-5 justify-center" />
    {/if}
    <!-- {#if $loggedIn}
        <section id="developerMode" class="w-3/4">
            <Text type="h4" classes="mb-3">{locale('views.settings.developerMode.title')}</Text>
            <Text type="p" secondary classes="mb-5">{locale('views.settings.developerMode.description')}</Text>
            <Checkbox label={locale('actions.enableDeveloperMode')} bind:checked={isDeveloperProfile} />
        </section>
        <HR classes="pb-5 mt-5 justify-center" />
    {/if} -->
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
        <Button medium classes="mb-6" inlineStyle="min-width: 156px;" onClick={() => handleDiagnosticsClick()}>
            {locale('views.settings.diagnostics.title')}
        </Button>

        <Text type="h5" classes="mb-3">{locale('views.settings.diagnostics.reporting.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.diagnostics.reporting.body')}</Text>
        <Checkbox label={locale('views.settings.diagnostics.reporting.checkbox')} bind:checked={$appSettings.diagnosticReporting} />
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
